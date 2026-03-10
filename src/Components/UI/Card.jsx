import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div
            className={cn('px-6 py-4 border-b border-gray-100', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3
            className={cn('text-lg font-semibold text-gray-900', className)}
            {...props}
        >
            {children}
        </h3>
    );
};

export const CardContent = ({ className, children, ...props }) => {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
};
