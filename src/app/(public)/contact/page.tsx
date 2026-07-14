"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = { name: string; email: string; subject: string; message: string };
const initialState: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
    const [form, setForm] = useState<FormState>(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message ?? "Failed to send message");
            }
            setSubmitted(true);
            setForm(initialState);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Get in Touch</h1>
                <p className="text-neutral-600 mt-2">
                    Questions about a mission, partnering with us, or press inquiries — we&apos;d like to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact info */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Emergency Hotline</h3>
                        <p className="text-neutral-600 text-sm">1-800-RESCUE-LINK</p>
                        <p className="text-neutral-500 text-xs mt-1">For active mission coordination only.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Support Team</h3>
                        <p className="text-neutral-600 text-sm">support@rescuelink.org</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Media Inquiries</h3>
                        <p className="text-neutral-600 text-sm">press@rescuelink.org</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Office</h3>
                        <p className="text-neutral-600 text-sm">Gulshan Avenue, Dhaka 1212, Bangladesh</p>
                    </div>
                </div>

                {/* Form */}
                <div className="md:col-span-2 bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    {submitted ? (
                        <div className="text-center py-12">
                            <p className="text-2xl mb-2">✓</p>
                            <h3 className="font-semibold text-neutral-900 mb-1">Message sent</h3>
                            <p className="text-neutral-600 text-sm">We&apos;ll get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    required
                                />
                            </div>
                            <Input
                                label="Subject"
                                value={form.subject}
                                onChange={(e) => update("subject", e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">Message</label>
                                <textarea
                                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-35"
                                    value={form.message}
                                    onChange={(e) => update("message", e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}