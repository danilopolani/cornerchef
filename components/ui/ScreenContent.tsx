import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ScreenContentProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenContent = React.forwardRef<View, ScreenContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          'flex-1 bg-white p-5',
          className
        )}
        {...props}
      >
        {children}
      </View>
    );
  }
);

ScreenContent.displayName = 'ScreenContent';
