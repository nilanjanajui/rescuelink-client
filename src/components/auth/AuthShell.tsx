"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";

type Stats = { totalMissions: number; totalVolunteers: number };

function useStats() {
    const [stats, setStats] = useState<Stats>({ totalMissions: 2400, totalVolunteers: 150000 });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
            .then((res) => res.json())
            .then((data) =>
                setStats({
                    totalMissions: data.totalMissions ?? 2400,
                    totalVolunteers: data.totalVolunteers ?? 150000,
                })
            )
            .catch(() => {
                // Fall back to the seeded defaults above if the API isn't reachable yet.
            });
    }, []);

    return stats;
}

function formatCount(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k+`;
    return `${n}`;
}

type AuthShellProps = {
    mode: "login" | "register";
    headline: ReactNode;
    subtext: string;
    children: ReactNode;
};

export default function AuthShell({ mode, headline, subtext, children }: AuthShellProps) {
    const stats = useStats();

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Brand panel */}
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary-dark to-neutral-900 text-white p-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />

                <div className="relative flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-lg">
                        ⛑️
                    </span>
                    <span className="text-xl font-semibold tracking-tight">RescueLink</span>
                </div>

                <div className="relative max-w-md">
                    <h1 className="text-4xl xl:text-5xl font-bold leading-tight">{headline}</h1>
                    <p className="mt-4 text-white/80 text-lg">{subtext}</p>
                </div>

                <div className="relative flex gap-4">
                    <div className="rounded-xl bg-white/10 border border-white/20 px-5 py-4">
                        <p className="text-2xl font-bold">{formatCount(stats.totalMissions)}</p>
                        <p className="text-sm text-white/70">Active Missions</p>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/20 px-5 py-4">
                        <p className="text-2xl font-bold">{formatCount(stats.totalVolunteers)}</p>
                        <p className="text-sm text-white/70">Certified Responders</p>
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-col items-center justify-center px-6 py-16 bg-neutral-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-primary text-lg">
                            ⛑️
                        </span>
                        <span className="text-xl font-semibold text-neutral-900">RescueLink</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
                        <div className="grid grid-cols-2 gap-1 mb-8 rounded-xl bg-neutral-100 p-1">
                            <Link
                                href="/login"
                                className={`text-center rounded-lg py-2 text-sm font-medium transition-colors ${mode === "login"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900"
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className={`text-center rounded-lg py-2 text-sm font-medium transition-colors ${mode === "register"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900"
                                    }`}
                            >
                                Create Account
                            </Link>
                        </div>

                        {children}
                    </div>

                    <p className="mt-6 text-center text-xs text-neutral-600">
                        Secure authentication provided by RescueLink Global
                    </p>
                </div>
            </div>
        </div>
    );
}