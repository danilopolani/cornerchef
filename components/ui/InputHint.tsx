import React from 'react';
import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Appearance } from 'react-native';

console.log(Appearance.getColorScheme());

interface InputHintProps extends TextProps {
  className?: string;
}

export const InputHint = React.forwardRef<Text, InputHintProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn('text-xs text-slate-400 mt-2', className)}
        {...props}>
        {children}
      </Text>
    );
  }
);

InputHint.displayName = 'InputHint';
