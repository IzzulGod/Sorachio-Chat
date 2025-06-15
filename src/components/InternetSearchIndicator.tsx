
import { Search, Globe } from 'lucide-react';

interface InternetSearchIndicatorProps {
  isSearching: boolean;
}

export const InternetSearchIndicator = ({ isSearching }: InternetSearchIndicatorProps) => {
  if (!isSearching) return null;

  return (
    <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4 mx-4 animate-fade-in">
      <div className="relative">
        {/* Main search icon with gentle bounce */}
        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" />
        
        {/* Scanning effect - moving dots around the search icon */}
        <div className="absolute -inset-2">
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-ping" 
               style={{ 
                 top: '0px', 
                 left: '50%', 
                 animationDelay: '0s',
                 animationDuration: '2s' 
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-ping" 
               style={{ 
                 top: '50%', 
                 right: '0px', 
                 animationDelay: '0.5s',
                 animationDuration: '2s' 
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-ping" 
               style={{ 
                 bottom: '0px', 
                 left: '50%', 
                 animationDelay: '1s',
                 animationDuration: '2s' 
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-ping" 
               style={{ 
                 top: '50%', 
                 left: '0px', 
                 animationDelay: '1.5s',
                 animationDuration: '2s' 
               }} 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-blue-500 dark:text-blue-300" />
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Mencari informasi terbaru dari internet...
        </span>
      </div>
      
      {/* Loading dots animation */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>
    </div>
  );
};
