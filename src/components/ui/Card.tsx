import { ReactNode, HTMLAttributes } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className = "", ...props }: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}