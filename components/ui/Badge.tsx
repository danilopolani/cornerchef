import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from '@/components/Themed';
import { cn } from '@/lib/utils';

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export const Badge = React.forwardRef<View, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-emerald-600',
      secondary: 'bg-gray-200',
      destructive: 'bg-red-600',
      outline: 'border border-gray-300 bg-transparent',
    };

    const textClasses = {
      default: 'text-white',
      secondary: 'text-slate-900',
      destructive: 'text-white',
      outline: 'text-slate-900',
    };

    return (
      <View
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <Text className={cn('text-xs font-semibold', textClasses[variant])}>
          {children}
        </Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';
