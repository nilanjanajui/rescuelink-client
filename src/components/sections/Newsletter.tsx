"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

function WatermarkShield(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="6" {...props}>
            <path d="M200 30 320 75v110c0 90-52 150-120 175C132 335 80 275 80 185V75Z" />
            <path d="M140 190l40 40 90-90" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3 5 5.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5L12 3Z" />
            <path d="m9.3 11.8 1.8 1.8 3.6-3.6" />
        </svg>
    );
}

function HandHeartIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3.5 15.5h4l2.8 1.4c1 .5 2.2.4 3-.4.9-.8.8-2.1-.2-2.8l-3.6-2.5H6.5l-3 2" />
            <path d="M3.5 12.8h2.3v5.4H3.5z" />
            <path d="M15.7 8.9c-.5-1.6.3-3 1.7-3.4 1-.3 1.9.1 2.4.9.5-.8 1.4-1.2 2.4-.9 1.4.4 2.2 1.8 1.7 3.4-.5 1.5-2.6 3-4.1 3.9-1.5-.9-3.6-2.4-4.1-3.9Z" />
        </svg>
    );
}

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error();
            setSubmitted(true);
            setEmail("");
        } catch {
            setError("Couldn't subscribe right now. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div
                className="relative overflow-hidden rounded-2xl text-white shadow-lg"
                style={{
                    background:
                        "linear-gradient(115deg, var(--color-primary) 0%, var(--color-primary-dark) 18%, var(--color-accent) 55%, var(--color-primary) 100%)",
                }}
            >
                <WatermarkShield className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 w-70 h-70 text-white/10 rotate-6" />

                <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 p-8 md:p-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Join the Frontline</h2>
                        <p className="text-white/85 mb-6 max-w-md">
                            Get real-time alerts about disasters in your region and find out how
                            you can contribute to the recovery effort.
                        </p>
                        {submitted ? (
                            <p className="font-medium">Thanks for subscribing!</p>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 max-w-md">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 min-w-45 bg-white rounded-full px-5 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="rounded-full bg-neutral-900 hover:bg-neutral-900/85 shrink-0"
                                        disabled={loading}
                                    >
                                        {loading ? "..." : "Sign Up Now"}
                                    </Button>
                                </form>
                                {error && <p className="text-sm text-white/85 mt-2">{error}</p>}
                                <p className="flex items-center gap-1.5 text-sm text-white/70 mt-3">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                    Join 150k+ responders worldwide
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center text-center gap-3">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15">
                            <HandHeartIcon className="w-8 h-8" />
                        </span>
                        <p className="text-sm text-white/85">Ready to make an impact?</p>
                        <Button variant="outline" className="bg-white text-primary border-white hover:bg-white/90">
                            Apply to Volunteer
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}