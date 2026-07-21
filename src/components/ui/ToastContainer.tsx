"use client";

import React, { createContext, useContext, useState } from "react";

export interface Toast {
    id: string;
    title: string;
    message: string;
    type?: "info" | "success" | "warning";
    link?: string;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => [newToast, ...prev].slice(0, 5));

        setTimeout(() => {
            removeToast(id);
        }, 6000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto bg-neutral-900 text-white rounded-xl p-4 shadow-xl border border-neutral-800 flex gap-3 items-start animate-in slide-in-from-bottom-5 duration-300"
                    >
                        <span className="text-xl shrink-0">🔔</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{toast.title}</p>
                            <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{toast.message}</p>
                            {toast.link && (
                                <a
                                    href={toast.link}
                                    className="inline-block mt-2 text-xs text-primary font-medium hover:underline"
                                >
                                    View Details →
                                </a>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-neutral-400 hover:text-white text-sm"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
