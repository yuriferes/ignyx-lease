import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-border-default bg-white px-3 text-sm text-text-primary placeholder:text-text-disabled shadow-xs transition-shadow duration-150 ease-apple focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
