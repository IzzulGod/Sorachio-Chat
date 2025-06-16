import { useState, useCallback } from 'react';
import { Chat, Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export const useChat = (selectedChatId: string | null) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingInternet, setIsSearchingInternet] = useState(false);
  const { toast } = useToast();

  const currentChat = chats.find(chat => chat.id === selectedChatId);
  
  console.log('🔍 useChat state:', {
    selectedChatId,
    chatsCount: chats.length,
    currentChatFound: !!currentChat,
    currentChatMessagesCount: currentChat?.messages?.length || 0,
    allChatIds: chats.map(c => c.id),
    isSearchingInternet
  });

  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('📝 Creating new chat:', newChat);
    
    setChats(prev => {
      const updated = [newChat, ...prev];
      console.log('📝 Updated chats array:', updated.map(c => ({ id: c.id, messagesCount: c.messages.length })));
      return updated;
    });
    
    return newChatId;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    console.log('🗑️ Deleting chat:', chatId);
    setChats(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      console.log('🗑️ Updated chats after deletion:', updated.map(c => c.id));
      return updated;
    });
  }, []);

  // Helper function to resize and compress image
  const processImageForAPI = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const MAX_SIZE = 800;
        let { width, height } = img;
        
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          } else {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Enhanced search keyword detection - improved to handle variations and typos
  const shouldSearchInternet = (content: string): boolean => {
    const normalizedContent = content.toLowerCase();
    
    const searchKeywords = [
      // Indonesian variations
      'terbaru', 'berita', 'informasi', 'update', 'sekarang', 'hari ini',
      'kapan', 'dimana', 'siapa', 'harga', 'cuaca', 'stock', 'saham',
      // Different variations of "carikan" including typos and informal spellings
      'carikan', 'cariin', 'cariin', 'cari kan', 'cari in', 'tolong carikan', 'tolong cari',
      'kasih tau', 'kasih tahu', 'info tentang', 'info soal',
      // English variations
      'latest', 'news', 'current', 'recent', 'today', 'now',
      'when', 'where', 'who', 'price', 'weather', 'find me', 'search for',
      'tell me about', 'information about', 'what is the latest'
    ];
    
    const hasSearchKeyword = searchKeywords.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );
    
    console.log('🔍 Search detection:', {
      content: content.substring(0, 50),
      hasSearchKeyword,
      matchedKeywords: searchKeywords.filter(keyword => normalizedContent.includes(keyword.toLowerCase()))
    });
    
    return hasSearchKeyword;
  };

  const sendMessage = useCallback(async (content: string, image?: File, targetChatId?: string, forceSearch?: boolean) => {
    const chatId = targetChatId || selectedChatId;
    
    console.log('🚀 sendMessage called with:', { 
      content: content.substring(0, 50) + '...', 
      providedChatId: targetChatId, 
      selectedChatId, 
      finalChatId: chatId, 
      hasImage: !!image,
      chatsCount: chats.length,
      forceSearch
    });

    if (!chatId) {
      console.error('❌ No chatId available');
      return;
    }

    // Check if internet search is needed - either forced or by keyword detection
    const needsSearch = forceSearch || shouldSearchInternet(content);
    console.log('🔍 Needs internet search:', needsSearch, '(forced:', forceSearch, ')');
    
    // Set loading states
    setIsLoading(true);
    if (needsSearch) {
      setIsSearchingInternet(true);
      console.log('🔍 Setting isSearchingInternet to true');
    }
    
    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        image: image ? URL.createObjectURL(image) : undefined,
        timestamp: new Date(),
      };

      console.log('✅ Created user message:', userMessage);

      // Add user message to chat immediately and capture the updated state
      let updatedChatWithUserMessage: Chat | undefined;
      await new Promise<void>((resolve) => {
        setChats(prev => {
          console.log('🔍 Looking for chat in current state:', {
            chatId,
            availableChats: prev.map(c => ({ id: c.id, messagesCount: c.messages.length }))
          });
          
          const updated = prev.map(chat => 
            chat.id === chatId 
              ? { 
                  ...chat, 
                  messages: [...chat.messages, userMessage],
                  title: chat.messages.length === 0 ? content.slice(0, 30) : chat.title,
                  updatedAt: new Date(),
                }
              : chat
          );
          
          updatedChatWithUserMessage = updated.find(c => c.id === chatId);
          console.log('📝 Updated chat with user message:', {
            chatId,
            found: !!updatedChatWithUserMessage,
            newMessagesCount: updatedChatWithUserMessage?.messages.length,
            lastMessage: updatedChatWithUserMessage?.messages[updatedChatWithUserMessage.messages.length - 1]?.content?.substring(0, 50)
          });
          
          setTimeout(resolve, 0);
          return updated;
        });
      });

      if (!updatedChatWithUserMessage) {
        console.error('❌ Target chat not found after adding user message:', { 
          chatId, 
          chatsCount: chats.length 
        });
        return;
      }

      console.log('✅ Successfully updated chat with user message, proceeding with API call...');

      // Prepare API request using the updated chat
      const messages = [
        {
          role: 'system',
          content: 'You are Sorachio, a friendly and helpful AI assistant developed by 1dle Labs, a company focused on building personal, conversational AI for both digital apps and robotic companions. Designed with a natural and emotionally aware tone, you aim to make interactions smooth, honest, and enjoyable. Respond clearly and politely. Avoid exaggeration or repetition. If unsure, admit it calmly. When you have access to internet search results, use them to provide accurate and up-to-date information, but always cite your sources. Always provide comprehensive and detailed responses. Make sure to provide complete information and don\'t cut off your responses.'
        },
        ...updatedChatWithUserMessage.messages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: content
        }
      ];

      console.log('📝 Prepared messages for API:', messages.length, 'messages');

      // Process image if provided
      let imageData = null;
      if (image) {
        console.log('🖼 Processing image...');
        try {
          imageData = await processImageForAPI(image);
          console.log('✅ Image processed and compressed');
        } catch (error) {
          console.error('❌ Image processing failed:', error);
          throw new Error('Gagal memproses gambar');
        }
      }

      // Use the new model you specified
      const apiPayload: any = {
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
      };

      // Add search query if needed
      if (needsSearch) {
        apiPayload.searchQuery = content;
        console.log('🔍 Added search query to payload');
      }

      // Add image to the latest user message if provided
      if (imageData) {
        const lastMessage = apiPayload.messages[apiPayload.messages.length - 1];
        lastMessage.content = [
          {
            type: 'text',
            text: content
          },
          {
            type: 'image_url',
            image_url: {
              url: imageData
            }
          }
        ];
        console.log('🖼 Added compressed image to payload');
      }

      console.log('📤 Sending request to Netlify function with model:', apiPayload.model);
      console.log('🔧 API Payload details:', {
        model: apiPayload.model,
        messagesCount: apiPayload.messages.length,
        maxTokens: apiPayload.max_tokens,
        hasSearchQuery: !!apiPayload.searchQuery,
        hasImage: !!imageData
      });

      // Use Netlify function with reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds

      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not ok:', errorText);
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
        
        if (response.status === 401) {
          throw new Error('Server belum dikonfigurasi dengan benar. Silakan hubungi developer.');
        } else if (response.status === 429) {
          throw new Error('Terlalu banyak request. Tunggu sebentar ya!');
        } else if (response.status === 502 || errorText.includes('timeout')) {
          throw new Error('Request timeout - coba lagi dengan gambar yang lebih kecil atau tanpa gambar');
        } else if (response.status >= 500) {
          throw new Error('Server sedang bermasalah. Coba lagi dalam beberapa saat.');
        }
        
        throw new Error(errorDetails || `Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received');
      console.log('📊 Response usage:', data.usage);
      console.log('📊 Response choices count:', data.choices?.length);
      console.log('📊 Full API response structure:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        firstChoiceKeys: data.choices?.[0] ? Object.keys(data.choices[0]) : [],
        hasMessage: !!data.choices?.[0]?.message,
        messageKeys: data.choices?.[0]?.message ? Object.keys(data.choices[0].message) : [],
        contentType: typeof data.choices?.[0]?.message?.content,
        contentLength: data.choices?.[0]?.message?.content?.length || 0
      });
      
      const aiResponse = data.choices?.[0]?.message?.content || 'Maaf, aku lagi error nih. Coba lagi ya!';
      console.log('🤖 AI Response details:', {
        responseLength: aiResponse.length,
        responsePreview: aiResponse.substring(0, 100) + '...',
        responseSuffix: aiResponse.length > 100 ? '...' + aiResponse.substring(aiResponse.length - 100) : '',
        isComplete: !aiResponse.endsWith('...') && aiResponse.length > 50,
        finishReason: data.choices?.[0]?.finish_reason
      });

      // Log the full response for debugging
      console.log('🤖 FULL AI RESPONSE:', aiResponse);

      // Create AI message with internet search flag
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        hasInternetContent: needsSearch, // Add flag to indicate internet content
      };

      console.log('🤖 Created AI message object with content length:', aiMessage.content.length);

      // Add AI message to chat
      setChats(prev => {
        const updated = prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, aiMessage],
                updatedAt: new Date(),
              }
            : chat
        );
        
        const updatedChat = updated.find(c => c.id === chatId);
        console.log('🤖 Updated chat with AI message:', {
          chatId,
          finalMessagesCount: updatedChat?.messages.length,
          lastMessageLength: updatedChat?.messages[updatedChat.messages.length - 1]?.content?.length
        });
        
        return updated;
      });

      console.log('✅ Message exchange completed successfully');

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      let errorMessage = "Gagal mengirim pesan. Coba lagi ya!";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timeout - coba lagi dengan gambar yang lebih kecil atau tanpa gambar";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timeout - coba lagi dengan gambar yang lebih kecil atau tanpa gambar";
        } else if (error.message.includes('Gagal memproses gambar')) {
          errorMessage = "Gagal memproses gambar - coba dengan format JPG/PNG yang lebih kecil";
        } else if (error.message.includes('Server belum dikonfigurasi')) {
          errorMessage = error.message;
        } else if (error.message.includes('Terlalu banyak request')) {
          errorMessage = error.message;
        } else if (error.message.includes('Server sedang bermasalah')) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSearchingInternet(false);
      console.log('🔍 Setting isSearchingInternet to false');
    }
  }, [selectedChatId, toast, chats]);

  return {
    chats,
    currentChat,
    createNewChat,
    deleteChat,
    sendMessage,
    isLoading,
    isSearchingInternet,
  };
};
