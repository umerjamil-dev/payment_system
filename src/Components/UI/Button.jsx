import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
    (
        { className, variant = 'primary', size = 'md', children, ...props },
        ref
    ) => {
        const variants = {
            primary: 'bg-primary text-white hover:bg-red-800 shadow-sm',
            secondary: 'bg-secondary text-white hover:bg-blue-900 shadow-sm',
            outline:
                'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            icon: 'p-2',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
