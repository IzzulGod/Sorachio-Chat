
import { Button } from '@/components/ui/button';
import { Chat } from '@/types/chat';
import { Download, FileText, FileJson } from 'lucide-react';
import { exportChatAsJSON, exportChatAsTXT } from '@/utils/chatExport';
import { useState, useEffect, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  selectedChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar = ({ 
  isOpen, 
  onClose, 
  chats, 
  selectedChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat 
}: SidebarProps) => {
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  console.log('Sidebar render - isOpen:', isOpen);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        // Check if click is not on export button or export options
        const target = event.target as HTMLElement;
        const isExportButton = target.closest('[data-export-button]');
        const isExportOption = target.closest('[data-export-option]');
        
        if (!isExportButton && !isExportOption) {
          setExpandedChatId(null);
        }
      }
    };

    if (expandedChatId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expandedChatId]);

  if (!isOpen) {
    console.log('Sidebar hidden because isOpen is false');
    return null;
  }

  const handleExportJSON = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    exportChatAsJSON(chat);
    setExpandedChatId(null); // Close menu after export
  };

  const handleExportTXT = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    exportChatAsTXT(chat);
    setExpandedChatId(null); // Close menu after export
  };

  const toggleExportMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setExpandedChatId(expandedChatId === chatId ? null : chatId);
  };

  const handleDeleteConfirm = (chatId: string) => {
    onDeleteChat(chatId);
    // Do not close sidebar after deletion
  };

  const handleDeleteTriggerClick = (e: React.MouseEvent) => {
    // Only prevent event propagation to avoid triggering parent click handlers
    // Do NOT prevent default as it breaks the AlertDialog trigger
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 md:w-80 bg-background border-r border-border z-50 md:relative">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="md:hidden text-foreground hover:bg-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </Button>
            </div>
            <Button
              onClick={onNewChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              + New Chat
            </Button>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chats.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No chats yet</p>
                <p className="text-xs mt-1">Start a new conversation!</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-lg transition-colors ${
                    selectedChatId === chat.id 
                      ? 'bg-accent' 
                      : 'hover:bg-accent/50'
                  }`}
                  ref={expandedChatId === chat.id ? exportMenuRef : null}
                >
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {chat.title || 'New Chat'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chat.messages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Export button with better mobile spacing */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => toggleExportMenu(e, chat.id)}
                          data-export-button="true"
                          className="md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 p-1.5 h-7 w-7 md:h-8 md:w-8 hover:bg-accent hover:scale-105 text-muted-foreground hover:text-foreground flex-shrink-0"
                          title="Export chat"
                        >
                          <Download size={14} />
                        </Button>
                        {/* Delete button with confirmation and better mobile spacing */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeleteTriggerClick}
                              className="md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 p-1.5 h-7 w-7 md:h-8 md:w-8 hover:bg-destructive/10 hover:text-destructive hover:scale-105 text-muted-foreground flex-shrink-0"
                              title="Delete chat"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the chat and all its messages.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteConfirm(chat.id);
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  {/* Export menu */}
                  {expandedChatId === chat.id && (
                    <div className="px-3 pb-3">
                      <div className="bg-muted/80 backdrop-blur-sm rounded-lg p-3 space-y-2 border border-border/50 shadow-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleExportJSON(e, chat)}
                          data-export-option="true"
                          className="w-full justify-start text-sm h-9 hover:bg-accent/80 hover:scale-[1.02] text-foreground transition-all duration-200 font-medium"
                        >
                          <FileJson size={16} className="mr-3 text-blue-500" />
                          Export as JSON
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleExportTXT(e, chat)}
                          data-export-option="true"
                          className="w-full justify-start text-sm h-9 hover:bg-accent/80 hover:scale-[1.02] text-foreground transition-all duration-200 font-medium"
                        >
                          <FileText size={16} className="mr-3 text-green-500" />
                          Export as TXT
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
