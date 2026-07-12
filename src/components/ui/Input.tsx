import { InputHTMLAttributes } from "react";

type InputProps = {
    label?: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-neutral-900 mb-1">{label}</label>}
            <input
                className={`w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-red-400" : "border-neutral-300"
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}