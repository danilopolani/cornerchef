import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextInputProps {
  className?: string;
  rows?: number;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        className={cn(
          // Base
          'px-3 py-2.5 text-sm rounded-md min-h-[80px]',
          // Borders/backgrounds with explicit colors
          'border border-gray-300',
          'bg-white',
          // Text colors
          'text-gray-900',
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

Textarea.displayName = 'Textarea';
