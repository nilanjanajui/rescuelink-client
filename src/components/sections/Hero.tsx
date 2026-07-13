"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        <section className="relative min-h-[65vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            <Image
                src="https://picsum.photos/seed/rescuelink-hero/1600/900"
                alt=""
                fill
                priority
                className="object-cover"
            />
            {/* Dark overlay so white text stays readable over any photo */}
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />

            <div className="relative">
                <span className="mb-4 inline-block px-3 py-1 rounded-full bg-red-100 text-primary text-xs font-semibold">
                    Live: {stats.totalMissions || 0} Active Missions
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl mx-auto">
                    Helping Communities Recover Faster
                </h1>
                <p className="mt-4 text-white/85 max-w-xl mx-auto">
                    Connecting local responders with global resources to manage crises in real-time. Secure, efficient, and community-driven relief logistics.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <Link href="/missions/add"><Button size="lg">Report a Crisis</Button></Link>
                    <Link href="/explore"><Button variant="outline" size="lg" className="bg-white/90 hover:bg-white">Find Missions</Button></Link>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">{volunteers}+</p>
                        <p className="text-sm text-white/80">Volunteers</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">{missions}</p>
                        <p className="text-sm text-white/80">Active Missions</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">{success}%</p>
                        <p className="text-sm text-white/80">Success</p>
                    </div>
                </div>
            </div>
        </section>
    );
}