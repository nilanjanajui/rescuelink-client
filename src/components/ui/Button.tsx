import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: ButtonProps) {
    const base =
        "rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
        secondary: "bg-accent text-white hover:bg-teal-700 focus:ring-accent",
        outline: "border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300",
    };
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-7 py-3 text-lg",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}