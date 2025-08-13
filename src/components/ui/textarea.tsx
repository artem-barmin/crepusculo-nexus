import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Following STYLE.md textarea specifications: square corners, min-height 120px, surface1 bg
        'flex min-h-[120px] w-full bg-gray-950 px-3 py-2 text-base text-white border border-gray-600 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 resize-vertical transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
