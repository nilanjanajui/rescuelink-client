import { InputHTMLAttributes, useId } from "react";

type InputProps = {
    label?: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={`w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-red-400" : "border-neutral-300"
                    } ${className}`}
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} className="text-sm text-red-600 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}