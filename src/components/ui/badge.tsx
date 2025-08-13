import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Following STYLE.md: inline-block, 1px border, uppercase, square corners, monochrome
  'inline-flex items-center border px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default: monochrome with UI border
        default: 'border-gray-600 bg-transparent text-white hover:bg-gray-900',
        // Secondary: slightly different background
        secondary: 'border-gray-600 bg-gray-950 text-white hover:bg-gray-900',
        // Destructive: red accent but maintaining monochrome approach
        destructive:
          'border-red-600 bg-transparent text-red-400 hover:bg-red-950',
        // Outline: just border, no background
        outline: 'border-gray-600 bg-transparent text-white hover:bg-gray-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
