import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const buttonVariants = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'border border-border bg-transparent',
  ghost: 'bg-transparent',
};

const buttonTextVariants = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
};

const buttonSizes = {
  default: 'py-3 px-6',
  sm: 'py-2 px-4',
  lg: 'py-4 px-8',
};

const buttonTextSizes = {
  default: 'text-base',
  sm: 'text-sm',
  lg: 'text-lg',
};

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'rounded-lg items-center justify-center flex-row',
        buttonVariants[variant],
        buttonSizes[size],
        isDisabled && 'opacity-50',
        className
      )}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#74b781' : 'white'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        className={cn(
          'font-semibold text-center',
          buttonTextVariants[variant],
          buttonTextSizes[size]
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
