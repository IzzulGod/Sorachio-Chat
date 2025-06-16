
import { Search, Globe } from 'lucide-react';

interface InternetSearchIndicatorProps {
  isSearching: boolean;
}

export const InternetSearchIndicator = ({ isSearching }: InternetSearchIndicatorProps) => {
  if (!isSearching) return null;

  return (
    <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4 mx-4 animate-fade-in">
      <div className="relative">
        {/* Main search icon with smooth float animation */}
        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-search-float" />
        
        {/* Subtle scanning dots around the search icon */}
        <div className="absolute -inset-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-search-dot-1" 
               style={{ 
                 top: '-2px', 
                 left: '50%', 
                 transform: 'translateX(-50%)'
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-search-dot-2" 
               style={{ 
                 top: '50%', 
                 right: '-2px', 
                 transform: 'translateY(-50%)'
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-search-dot-3" 
               style={{ 
                 bottom: '-2px', 
                 left: '50%', 
                 transform: 'translateX(-50%)'
               }} 
          />
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute animate-search-dot-4" 
               style={{ 
                 top: '50%', 
                 left: '-2px', 
                 transform: 'translateY(-50%)'
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
