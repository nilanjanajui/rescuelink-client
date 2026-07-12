"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

function useCountUp(target: number, duration = 1500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!target) return;
        let start: number;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return count;
}

type Stats = { totalMissions: number; totalVolunteers: number; successRate: number };

export default function Hero() {
    const [stats, setStats] = useState<Stats>({ totalMissions: 0, totalVolunteers: 0, successRate: 0 });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
            .then((res) => res.json())
            .then(setStats)
            .catch(() => { });
    }, []);

    const missions = useCountUp(stats.totalMissions);
    const volunteers = useCountUp(stats.totalVolunteers);
    const success = useCountUp(stats.successRate);

    return (
        <section className="min-h-[65vh] flex flex-col justify-center items-center text-center px-4 bg-linear-to-b from-red-50 to-white">
            <span className="mb-4 px-3 py-1 rounded-full bg-red-100 text-primary text-xs font-semibold">
                Live: {stats.totalMissions || 0} Active Missions
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 max-w-3xl">
                Helping Communities Recover Faster
            </h1>
            <p className="mt-4 text-neutral-600 max-w-xl">
                Connecting local responders with global resources to manage crises in real-time. Secure, efficient, and community-driven relief logistics.
            </p>
            <div className="mt-8 flex gap-4">
                <Link href="/missions/add"><Button size="lg">Report a Crisis</Button></Link>
                <Link href="/explore"><Button variant="outline" size="lg">Find Missions</Button></Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900">{volunteers}+</p>
                    <p className="text-sm text-neutral-600">Volunteers</p>
                </div>
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900">{missions}</p>
                    <p className="text-sm text-neutral-600">Active Missions</p>
                </div>
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900">{success}%</p>
                    <p className="text-sm text-neutral-600">Success</p>
                </div>
            </div>
        </section>
    );
}