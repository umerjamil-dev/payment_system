import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'bg-slate-50 text-slate-500 border border-slate-200/60',
        primary: 'bg-primary/5 text-primary border border-primary/10',
        secondary: 'bg-secondary/5 text-secondary border border-secondary/10',
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border border-amber-100',
        danger: 'bg-red-50 text-red-600 border border-red-100',
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
