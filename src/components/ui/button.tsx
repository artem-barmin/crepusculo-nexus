import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles following STYLE.md "Load More" pattern
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed user-select-none cursor-pointer border border-white bg-black text-white hover:bg-gray-800 active:bg-gray-700',
  {
    variants: {
      variant: {
        // Default follows STYLE.md canonical button
        default: 'border-white bg-black text-white hover:bg-gray-800',
        // Destructive maintains the square aesthetic
        destructive: 'border-red-600 bg-black text-red-600 hover:bg-red-950',
        // Outline variant with UI border color
        outline: 'border-gray-600 bg-black text-white hover:bg-gray-900',
        // Secondary uses surface colors
        secondary: 'border-gray-600 bg-gray-950 text-white hover:bg-gray-900',
        // Ghost has no border but maintains hover
        ghost: 'border-transparent bg-transparent text-white hover:bg-gray-900',
        // Link style
        link: 'border-transparent bg-transparent text-white underline-offset-4 hover:underline hover:bg-transparent',
      },
      size: {
        default: 'h-[42px] px-4 py-2', // 42px height from STYLE.md
        sm: 'h-[36px] px-3 py-2', // Small size from STYLE.md
        lg: 'h-[48px] px-5 py-3', // Large size from STYLE.md
        icon: 'h-[42px] w-[42px] p-0', // Square icon button
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
