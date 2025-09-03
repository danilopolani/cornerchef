import React from 'react';
import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/utils';

interface LabelProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Label = React.forwardRef<Text, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          // Transparent background to avoid blocks
          'bg-transparent',
          // Typography
          'text-sm font-medium leading-none mb-1.5',
          // Explicit colors
          'text-gray-900',
          // Disabled
          'opacity-100',
          className
        )}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = 'Label';
