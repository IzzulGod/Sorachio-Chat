
export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  snippet?: string;
}

export interface BraveSearchResponse {
  web?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      snippet?: string;
    }>;
  };
}

export const searchInternet = async (query: string, apiKey: string): Promise<BraveSearchResult[]> => {
  try {
    console.log('🔍 Searching internet with query:', query);
    
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
    });

    if (!response.ok) {
      console.error('❌ Brave Search API error:', response.status, response.statusText);
      throw new Error(`Brave Search API error: ${response.status}`);
    }

    const data: BraveSearchResponse = await response.json();
    console.log('✅ Brave Search results received:', data.web?.results?.length || 0, 'results');
    
    return data.web?.results?.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      snippet: result.snippet
    })) || [];
    
  } catch (error) {
    console.error('❌ Internet search error:', error);
    throw error;
  }
};

export const formatSearchResultsForAI = (results: BraveSearchResult[]): string => {
  if (results.length === 0) {
    return 'No search results found.';
  }

  return results.map((result, index) => 
    `[${index + 1}] ${result.title}\n${result.description}\nSource: ${result.url}\n`
  ).join('\n');
};
