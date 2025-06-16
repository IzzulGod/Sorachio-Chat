
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchModeToggleProps {
  isSearchMode: boolean;
  onToggle: (isSearchMode: boolean) => void;
}

export const SearchModeToggle = ({ isSearchMode, onToggle }: SearchModeToggleProps) => {
  return (
    <div className="flex justify-start">
      <Button
        variant={isSearchMode ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(!isSearchMode)}
        className="flex items-center space-x-1 h-7 px-2 text-xs"
      >
        <Search size={12} />
        <span>{isSearchMode ? "Search" : "Search"}</span>
      </Button>
    </div>
  );
};
