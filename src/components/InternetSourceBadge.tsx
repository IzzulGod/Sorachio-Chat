
import { Globe } from 'lucide-react';

interface InternetSourceBadgeProps {
  hasInternetContent: boolean;
}

export const InternetSourceBadge = ({ hasInternetContent }: InternetSourceBadgeProps) => {
  if (!hasInternetContent) return null;

  return (
    <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full mb-2">
      <Globe className="w-3 h-3 text-green-600 dark:text-green-400" />
      <span className="text-xs text-green-700 dark:text-green-300 font-medium">Dengan informasi internet terbaru</span>
    </div>
  );
};
