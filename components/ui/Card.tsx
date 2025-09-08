import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from '@/components/Themed';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<View, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          // Explicit border/background colors for RN
          'rounded-lg border shadow-sm',
          'border-gray-200',
          'bg-white',
          className
        )}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn('p-6 pb-0', className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
  return (
    <Text className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100', className)}>
      {children}
    </Text>
  );
};

export const CardContent = React.forwardRef<View, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn('p-6 pt-4', className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
