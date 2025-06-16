
import { Message } from '@/types/chat';
import { User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { InternetSourceBadge } from '@/components/InternetSourceBadge';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const contentRef = useRef<HTMLDivElement>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log('🔍 MessageBubble Debug:', {
      role: message.role,
      contentLength: message.content?.length || 0,
      contentPreview: message.content?.substring(0, 100),
      hasImage: !!message.image,
    });
    
    if (!isUser && message.content) {
      console.log('📝 Full AI message content:', message.content);
    }
  }, [message, isUser]);

  // Enhanced content processing with better markdown handling and improved spacing
  const processContent = (content: string) => {
    console.log('🔄 Processing content:', {
      originalLength: content.length,
      contentPreview: content.substring(0, 100),
      hasCodeBlocks: content.includes('```'),
      hasLinks: content.includes('http') || content.includes('[')
    });
    
    let processed = content;

    // Simplified code block processing - just clean formatting without header/copy button
    processed = processed.replace(/```(\w*)\s*\n?([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.trim();
      
      console.log('📦 Processing code block:', { 
        codeLength: cleanCode.length
      });
      
      const escapedCode = cleanCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return `<div class="my-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm">
        <div class="overflow-x-auto">
          <pre class="p-3 text-sm leading-tight text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-words" style="tab-size: 2;"><code>${escapedCode}</code></pre>
        </div>
      </div>`;
    });

    // Enhanced inline code processing
    processed = processed.replace(/(?<!`)`([^`\n]+?)`(?!`)/g, 
      '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-600">$1</code>');

    // Enhanced markdown links
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium" target="_blank" rel="noopener noreferrer">$1</a>');

    // Auto-link URLs that aren't in markdown format
    processed = processed.replace(/(?<!href="|>)(https?:\/\/[^\s<>"]+)/g, 
      '<a href="$1" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium break-all" target="_blank" rel="noopener noreferrer">$1</a>');

    // Enhanced headers with better styling and compact spacing
    processed = processed.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
      const level = hashes.length;
      const sizes = ['text-lg', 'text-base', 'text-base', 'text-sm', 'text-sm', 'text-xs'];
      const weights = ['font-bold', 'font-bold', 'font-semibold', 'font-medium', 'font-medium', 'font-normal'];
      const className = `${sizes[level - 1] || 'text-sm'} ${weights[level - 1] || 'font-medium'}`;
      return `<h${level} class="${className} mt-2 mb-1 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-0.5">${text.trim()}</h${level}>`;
    });

    // Enhanced bold and italic
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
    processed = processed.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');

    // Enhanced lists with compact spacing
    const lines = processed.split('\n');
    let inList = false;
    let processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
      
      if (listMatch) {
        const [, indent, marker, text] = listMatch;
        const level = Math.floor(indent.length / 2);
        const isOrdered = /^\d+\./.test(marker);
        
        if (!inList) {
          const listTag = isOrdered ? 'ol' : 'ul';
          const listClass = isOrdered ? 'list-decimal' : 'list-disc';
          processedLines.push(`<${listTag} class="pl-4 my-1 space-y-0 ${listClass}">`);
          inList = true;
        }
        
        processedLines.push(`<li class="ml-${level * 3} leading-tight text-sm mb-0">${text}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ol></ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      processedLines.push('</ol></ul>');
    }
    
    processed = processedLines.join('\n');

    // Enhanced blockquotes with compact spacing
    processed = processed.replace(/^>\s+(.+)$/gm, 
      '<blockquote class="border-l-3 border-gray-300 dark:border-gray-600 pl-2 py-0.5 my-1 bg-gray-50 dark:bg-gray-800 rounded-r italic text-gray-700 dark:text-gray-300 text-sm">$1</blockquote>');

    // Tables with compact spacing
    processed = processed.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim()).filter(cell => cell);
      return `<tr class="border-b border-gray-200 dark:border-gray-700">${cells.map(cell => 
        `<td class="px-2 py-0.5 text-sm">${cell}</td>`
      ).join('')}</tr>`;
    });
    
    if (processed.includes('<tr')) {
      processed = processed.replace(/(<tr.*?>.*?<\/tr>)/gs, 
        '<table class="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg my-2 overflow-hidden">$1</table>');
    }

    // Convert line breaks with much tighter spacing
    processed = processed.replace(/\n\s*\n\s*\n+/g, '\n\n'); // Convert triple+ line breaks to double
    processed = processed.replace(/\n\n/g, '<br class="my-0.5">'); // Very tight paragraph spacing
    processed = processed.replace(/\n/g, '<br>');

    console.log('✅ Content processing complete:', {
      processedLength: processed.length,
      hasCodeElements: processed.includes('<pre'),
      hasLinkElements: processed.includes('<a href'),
      hasTableElements: processed.includes('<table')
    });

    return processed;
  };
  
  const handleImageClick = () => {
    setShowFullImage(true);
  };

  const handleCloseFullImage = () => {
    setShowFullImage(false);
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-3 w-full animate-fade-in`}>
      {!isUser && (
        <img 
          src="/lovable-uploads/63083a92-c115-4af0-86c6-164b93752c8c.png" 
          alt="Sorachio" 
          className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-blue-100 dark:ring-blue-900"
        />
      )}
      
      <div className={`
        px-4 py-3 rounded-lg relative transition-all duration-200 hover:shadow-md
        ${isUser 
          ? 'bg-gray-900 text-white rounded-br-sm max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] dark:bg-gray-100 dark:text-gray-900' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] border border-gray-200 dark:border-gray-700'
        }
      `}>
        {/* Show internet source badge for AI messages with internet content */}
        {!isUser && message.hasInternetContent && (
          <InternetSourceBadge hasInternetContent={true} />
        )}
        
        {message.image && (
          <div className="mb-2">
            <AspectRatio ratio={16 / 9} className="w-full max-w-sm">
              <img 
                src={message.image} 
                alt="Uploaded image" 
                className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
              />
            </AspectRatio>
          </div>
        )}
        
        {isUser ? (
          <div>
            <p className="text-sm whitespace-pre-wrap break-words leading-tight">{message.content}</p>
          </div>
        ) : (
          <div
            ref={contentRef}
            className="text-sm break-words leading-tight
                       prose prose-sm max-w-none dark:prose-invert 
                       [&>div]:overflow-visible [&>div>div>pre]:overflow-x-auto 
                       [&_code]:text-xs [&_pre]:text-xs [&_table]:text-xs
                       [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm
                       [&_a]:break-all [&_a]:word-break-all
                       [&_pre]:whitespace-pre-wrap [&_pre]:break-words
                       [&_p]:leading-tight [&_li]:leading-tight
                       [&_p]:my-0 [&_div]:my-0 [&_br]:my-0
                       [&_ul]:my-1 [&_ol]:my-1 [&_li]:mb-0"
            style={{ 
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%',
              lineHeight: '1.3'
            }}
            dangerouslySetInnerHTML={{ __html: processContent(message.content) }}
          />
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
          <User className="w-4 h-4 text-white dark:text-gray-900" />
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImage && message.image && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={handleCloseFullImage}>
          <div className="relative max-w-full max-h-full">
            <img 
              src={message.image} 
              alt="Full size image" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleCloseFullImage}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
