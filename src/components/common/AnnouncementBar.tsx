import React from 'react';
import { Heart } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#211C15] text-[#FAF8F5] px-4 py-2 text-xs md:text-sm font-medium text-center flex items-center justify-center gap-2 border-b border-[#383025]">
      <Heart className="w-3.5 h-3.5 text-[#B95B3D] fill-[#B95B3D] shrink-0" />
      <span>
        You don&apos;t have to navigate motherhood, marriage, and life alone. Welcome to your safe space.
      </span>
    </div>
  );
};
