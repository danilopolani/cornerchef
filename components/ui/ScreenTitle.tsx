import React from 'react';
import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ScreenTitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenTitle = React.forwardRef<Text, ScreenTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          // Typography
          'text-2xl font-bold leading-none mt-2 mb-8',
          // Explicit colors
          'text-slate-900',
          className
        )}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

ScreenTitle.displayName = 'ScreenTitle';
