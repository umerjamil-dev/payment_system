import React from 'react';
import { cn } from '../../lib/utils';

export const Table = ({ className, children, ...props }) => (
    <div className="w-full overflow-auto">
        <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ className, children, ...props }) => (
    <thead className={cn('[&_tr]:border-b bg-gray-50/50', className)} {...props}>
        {children}
    </thead>
);

export const TableBody = ({ className, children, ...props }) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
        {children}
    </tbody>
);

export const TableRow = ({ className, children, ...props }) => (
    <tr
        className={cn(
            'border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100',
            className
        )}
        {...props}
    >
        {children}
    </tr>
);

export const TableHead = ({ className, children, ...props }) => (
    <th
        className={cn(
            'h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
            className
        )}
        {...props}
    >
        {children}
    </th>
);

export const TableCell = ({ className, children, ...props }) => (
    <td
        className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
        {...props}
    >
        {children}
    </td>
);
