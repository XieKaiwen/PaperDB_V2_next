import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingSuspense({
  children,
  size = 'md',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  return <Suspense fallback={<LoadingSpinner size={size} />}>{children}</Suspense>;
}
