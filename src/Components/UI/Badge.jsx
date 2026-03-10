import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-red-100 text-primary',
        secondary: 'bg-blue-100 text-secondary',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
