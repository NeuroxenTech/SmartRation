import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = "primary", size = "md", ...props }) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        outline: "border border-gray-300 hover:bg-gray-50",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={cn("rounded-md font-medium transition-colors disabled:opacity-50", variants[variant], sizes[size], className)}
            {...props}
        />
    );
};

export const Input = ({ className, ...props }) => (
    <input
        className={cn("w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
        {...props}
    />
);

export const Card = ({ className, children, ...props }) => (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-100 p-4", className)} {...props}>
        {children}
    </div>
);

export const Badge = ({ className, variant = "default", children }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800"
    };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
}

