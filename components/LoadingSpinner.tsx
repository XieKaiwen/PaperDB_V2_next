import { Loader2 } from 'lucide-react';
import React from 'react';

export default function LoadingSpinner({ size = 'md' }: { size: string }) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white/90">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
    </div>
  );
}
