"use client";
import { ReactNode, useEffect, useId, useRef } from "react";

export default function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        // Move focus into the dialog so keyboard/screen-reader users land
        // somewhere sensible, and let Escape close it like any native dialog.
        panelRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 focus:outline-none"
            >
                <h3 id={titleId} className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
}