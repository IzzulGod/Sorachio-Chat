import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { Sidebar } from '@/components/Sidebar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatInput } from '@/components/ChatInput';
import { InternetSearchIndicator } from '@/components/InternetSearchIndicator';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { chats, currentChat, createNewChat, deleteChat, sendMessage, isLoading, isSearchingInternet } = useChat(selectedChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    console.log('🔄 Attempting to scroll to bottom...');
    
    if (messagesContainerRef.current) {
      console.log('📜 Scrolling messages container');
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    if (messagesEndRef.current) {
      console.log('📍 Scrolling to messagesEndRef');
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  }, []);

  // Force scroll when messages change
  useEffect(() => {
    if (currentChat?.messages && currentChat.messages.length > 0) {
      console.log('📨 Messages changed, scrolling...', currentChat.messages.length);
      setTimeout(scrollToBottom, 0);
      setTimeout(scrollToBottom, 100);
      setTimeout(scrollToBottom, 300);
    }
  }, [currentChat?.messages, scrollToBottom]);

  // Scroll when loading state changes
  useEffect(() => {
    if (!isLoading && currentChat?.messages && currentChat.messages.length > 0) {
      console.log('✅ Loading finished, scrolling...');
      setTimeout(scrollToBottom, 200);
      setTimeout(scrollToBottom, 500);
    }
  }, [isLoading, scrollToBottom, currentChat?.messages]);

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(scrollToBottom, 100);
    };

    const handleOrientationChange = () => {
      setTimeout(scrollToBottom, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [scrollToBottom]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleSendMessage = async (content: string, image?: File) => {
    console.log('🚀 Starting handleSendMessage...', { 
      selectedChatId, 
      chatsCount: chats.length, 
      hasContent: !!content.trim() 
    });
    
    scrollToBottom();
    
    let targetChatId = selectedChatId;
    
    // Jika tidak ada chat yang dipilih atau chat tidak ditemukan, buat chat baru
    if (!selectedChatId || !chats.find(chat => chat.id === selectedChatId)) {
      console.log('📝 Creating new chat for first message');
      targetChatId = createNewChat();
      setSelectedChatId(targetChatId);
      console.log('✅ New chat created and selected:', targetChatId);
    }
    
    console.log('📤 Sending message to chat:', targetChatId);
    await sendMessage(content, image, targetChatId);
    
    setTimeout(scrollToBottom, 50);
    setTimeout(scrollToBottom, 200);
    setTimeout(scrollToBottom, 500);
  };

  const handleNewChat = () => {
    console.log('🆕 Creating new chat and returning to welcome screen');
    createNewChat();
    setSelectedChatId(null); // Reset ke null untuk menampilkan WelcomeScreen
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    console.log('🔄 Selecting chat:', chatId);
    setSelectedChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    if (selectedChatId === chatId) {
      console.log('🗑️ Deleted active chat, resetting selectedChatId to null');
      setSelectedChatId(null);
    }
  };

  const handleToggleSidebar = useCallback(() => {
    console.log('Toggling sidebar. Current state:', sidebarOpen, 'New state:', !sidebarOpen);
    setSidebarOpen(prev => !prev);
  }, [sidebarOpen]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  console.log('🔍 Index render state:', {
    selectedChatId,
    currentChatId: currentChat?.id,
    currentChatMessagesCount: currentChat?.messages?.length || 0,
    chatsCount: chats.length,
    sidebarOpen,
    isLoading,
    isSearchingInternet
  });

  // Perbaiki logika render - tampilkan welcome screen jika tidak ada chat ATAU chat kosong (tidak ada pesan)
  const shouldShowWelcome = !selectedChatId || !currentChat || (currentChat.messages.length === 0);
  console.log('🎯 Render decision:', { 
    shouldShowWelcome, 
    hasSelectedChatId: !!selectedChatId,
    hasCurrentChat: !!currentChat,
    messagesCount: currentChat?.messages?.length || 0,
    reason: !selectedChatId ? 'no selectedChatId' : !currentChat ? 'no currentChat' : currentChat.messages.length === 0 ? 'empty chat' : 'has messages'
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden full-height">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        chats={chats}
        selectedChatId={selectedChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="flex-1 flex flex-col relative chat-container w-full min-w-0">
        {sidebarOpen && (
          <div 
            className="sidebar-overlay md:hidden"
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
          />
        )}
        
        <div className="flex-1 overflow-hidden min-h-0 messages-container">
          {shouldShowWelcome ? (
            <WelcomeScreen onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />
          ) : (
            <>
              <ChatContainer
                messages={currentChat.messages}
                isLoading={isLoading}
                onToggleSidebar={handleToggleSidebar}
                sidebarOpen={sidebarOpen}
                messagesContainerRef={messagesContainerRef}
              />
            </>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        
        {/* Move internet search indicator above input area for better mobile visibility */}
        {isSearchingInternet && (
          <div className="flex-shrink-0">
            <InternetSearchIndicator isSearching={isSearchingInternet} />
          </div>
        )}
        
        <div className="input-area flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
