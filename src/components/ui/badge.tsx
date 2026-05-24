import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-navy-subtle text-ignyx-navy',
        success: 'bg-success-bg text-success',
        warning: 'bg-warning-bg text-warning',
        error: 'bg-error-bg text-error',
        info: 'bg-info-bg text-info',
        neutral: 'bg-surface text-text-secondary',
        outline: 'border border-border-default text-text-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
