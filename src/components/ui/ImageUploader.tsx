"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/components/providers/LanguageContext";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useUrlTab, setUseUrlTab] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file (PNG, JPG, WebP).");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await apiFetch<{ url: string }>("/upload", {
                method: "POST",
                body: formData,
            });

            onChange(data.url);
        } catch (err) {
            setError("Image upload failed. Try again or paste a URL.");
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-900">
                    Mission Cover Image
                </label>
                <button
                    type="button"
                    onClick={() => setUseUrlTab(!useUrlTab)}
                    className="text-xs text-primary font-medium hover:underline"
                >
                    {useUrlTab ? "← Switch to Device File Upload" : "Or enter Image URL →"}
                </button>
            </div>

            {useUrlTab ? (
                <div>
                    <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            ) : (
                <div>
                    {value ? (
                        <div className="relative h-48 w-full rounded-xl overflow-hidden border border-neutral-200 group">
                            <Image src={value} alt="Mission preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-neutral-900 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-neutral-100 shadow-sm"
                                >
                                    {t("upload.change")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange("")}
                                    className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-700 shadow-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                                dragActive ? "border-primary bg-primary/5" : "border-neutral-300 hover:border-primary/50"
                            }`}
                        >
                            <span className="text-3xl block mb-2">📸</span>
                            <p className="text-sm font-medium text-neutral-700">
                                {uploading ? t("upload.uploading") : t("upload.drag_drop")}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WebP up to 10MB</p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleFile(e.target.files[0]);
                        }}
                    />
                </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
