"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        setSubmitted(true);
        setEmail("");
    }

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="bg-primary rounded-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-white relative overflow-hidden">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Join the Frontline</h2>
                    <p className="text-white/90 mb-4">Get real-time alerts about disasters in your region and find out how you can contribute to the recovery effort.</p>
                    {submitted ? (
                        <p className="font-medium">Thanks for subscribing!</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 rounded-xl px-4 py-2.5 text-neutral-900 focus:outline-none"
                            />
                            <Button type="submit" variant="secondary">Sign Up</Button>
                        </form>
                    )}
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-sm text-white/90">Ready to make an impact?</p>
                    <Button variant="outline" className="bg-white text-primary border-white">Apply to Volunteer</Button>
                </div>
            </div>
        </section>
    );
}