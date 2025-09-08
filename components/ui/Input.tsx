import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';
import { InputHint } from './InputHint';

interface InputProps extends TextInputProps {
  className?: string;
  hint?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, hint, ...props }, ref) => {
    return <>
      <TextInput
        ref={ref}
        className={cn(
          // Base
          'px-3 py-2.5 text-sm rounded-md',
          // Visible borders/backgrounds on RN (avoid CSS vars)
          'border border-gray-300 ',
          'bg-white ',
          // Text colors
          'text-slate-900 ',
          // Focus styles
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          // Disabled
          'disabled:opacity-50',
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {hint && <InputHint className="mt-2">{hint}</InputHint>}
    </>;
  }
);

Input.displayName = 'Input';
