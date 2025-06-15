exports.handler = async (event, context) => {
  console.log('🚀 Netlify function called');
  console.log('📝 Method:', event.httpMethod);
  console.log('📝 Headers:', event.headers);
  
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Debug environment variables
    console.log('🌍 All environment keys:', Object.keys(process.env));
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🌍 NETLIFY:', process.env.NETLIFY);
    
    // Check API keys
    const apiKey = process.env.OPENROUTER_API_KEY;
    const braveApiKey = process.env.BRAVE_API_KEY;
    
    console.log('🔑 OpenRouter API Key exists:', !!apiKey);
    console.log('🔍 Brave API Key exists:', !!braveApiKey);
    console.log('🔑 OpenRouter API Key length:', apiKey ? apiKey.length : 0);
    console.log('🔑 OpenRouter API Key prefix:', apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING');
    console.log('🔑 Raw API Key type:', typeof apiKey);
    
    // More thorough API key validation
    if (!apiKey || apiKey.trim() === '' || apiKey === 'undefined') {
      console.error('❌ OPENROUTER_API_KEY not found or invalid in environment variables');
      console.error('❌ Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENROUTER')));
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          error: 'Server Configuration Error', 
          details: 'API key not configured. Please set OPENROUTER_API_KEY environment variable.',
          timestamp: new Date().toISOString(),
          debug: {
            apiKeyExists: !!apiKey,
            apiKeyType: typeof apiKey,
            envKeys: Object.keys(process.env).filter(key => key.includes('OPENROUTER'))
          }
        }),
      };
    }
    
    console.log('📝 Raw body length:', event.body?.length);
    const body = JSON.parse(event.body);
    console.log('✅ Parsed body model:', body.model);
    console.log('✅ Messages count:', body.messages?.length);
    console.log('🔍 Search query:', body.searchQuery);
    
    // Handle internet search if requested
    let searchResults = '';
    if (body.searchQuery && braveApiKey) {
      try {
        console.log('🔍 Performing internet search...');
        const searchResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(body.searchQuery)}&count=5`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': braveApiKey,
          },
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const results = searchData.web?.results || [];
          
          searchResults = results.length > 0 
            ? '\n\nInformasi terbaru dari internet:\n' + results.map((result, index) => 
                `[${index + 1}] ${result.title}\n${result.description}\nSumber: ${result.url}\n`
              ).join('\n')
            : '\n\nTidak ada hasil pencarian internet yang ditemukan.';
            
          console.log('✅ Internet search completed:', results.length, 'results');
        } else {
          console.log('❌ Internet search failed:', searchResponse.status);
        }
      } catch (searchError) {
        console.error('❌ Internet search error:', searchError);
      }
    } else if (body.searchQuery && !braveApiKey) {
      console.log('⚠️ Search requested but Brave API key not available');
    }
    
    // Update the last user message with search results if available
    if (searchResults && body.messages && body.messages.length > 0) {
      const lastMessage = body.messages[body.messages.length - 1];
      if (lastMessage.role === 'user') {
        lastMessage.content = lastMessage.content + searchResults;
        console.log('✅ Added search results to user message');
      }
    }
    
    // Check if we have image content
    const hasImage = body.messages?.some(msg => 
      Array.isArray(msg.content) && 
      msg.content.some(item => item.type === 'image_url')
    );
    console.log('🖼 Has image content:', hasImage);
    
    // Start the request
    console.log('📤 Making request to OpenRouter...');
    const startTime = Date.now();
    
    const requestHeaders = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sorachio.netlify.app',
      'X-Title': 'Sorachio Chat App',
    };
    
    console.log('📤 Request headers (without auth):', { 
      'Content-Type': requestHeaders['Content-Type'],
      'HTTP-Referer': requestHeaders['HTTP-Referer'],
      'X-Title': requestHeaders['X-Title']
    });
    
    console.log('🔑 Auth header format check:', requestHeaders['Authorization'].startsWith('Bearer '));
    console.log('🔑 Auth header length:', requestHeaders['Authorization'].length);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    const requestTime = Date.now() - startTime;
    console.log('📥 OpenRouter response status:', response.status);
    console.log('📥 OpenRouter response headers:', Object.fromEntries(response.headers.entries()));
    console.log('⏱ Request took:', requestTime, 'ms');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter error response:', errorText);
      console.error('❌ OpenRouter error status:', response.status);
      console.error('❌ OpenRouter error headers:', Object.fromEntries(response.headers.entries()));
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
        console.error('❌ Parsed error message:', errorDetails);
      } catch (e) {
        console.error('❌ Could not parse error as JSON');
      }
      
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          error: 'OpenRouter API Error', 
          details: errorDetails,
          status: response.status,
          originalError: errorText,
          timestamp: new Date().toISOString()
        }),
      };
    }

    const data = await response.json();
    console.log('✅ OpenRouter response received');
    console.log('📊 Response tokens:', data.usage);
    console.log('📊 Response choices count:', data.choices?.length);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('❌ Netlify function error:', error);
    console.error('❌ Error stack:', error.stack);
    
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.name === 'SyntaxError') {
      errorDetails = 'Invalid JSON in request body';
      statusCode = 400;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorDetails = 'Unable to connect to OpenRouter API';
      statusCode = 502;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorDetails = 'Network error connecting to OpenRouter API';
      statusCode = 502;
    }
    
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        details: errorDetails,
        timestamp: new Date().toISOString(),
        errorType: error.name,
        originalMessage: error.message
      }),
    };
  }
};
