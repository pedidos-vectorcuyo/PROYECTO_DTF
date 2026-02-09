import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to,
    href,
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

    const variants = {
        primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary shadow-sm hover:shadow-md",
        secondary: "bg-white text-text-main border border-gray-border hover:bg-gray-50 focus:ring-gray-200",
        ghost: "bg-transparent text-text-secondary hover:text-primary hover:bg-blue-50",
        danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger",
    };

    const sizes = {
        sm: "px-4 py-1.5 text-xs h-8",
        md: "px-6 py-2.5 text-sm h-11", // Standard 44px approx
        lg: "px-8 py-3 text-base h-12",
        icon: "p-2 h-10 w-10",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={classes} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
