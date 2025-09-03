import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Appearance, useColorScheme } from 'react-native';

console.log(Appearance.getColorScheme());

interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          // Base
          'px-3 py-2.5 text-sm rounded-md',
          // Visible borders/backgrounds on RN (avoid CSS vars)
          'border border-gray-300 ',
          'bg-white ',
          // Text colors
          'text-gray-900 ',
          // Focus styles
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          // Disabled
          'disabled:opacity-50',
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
