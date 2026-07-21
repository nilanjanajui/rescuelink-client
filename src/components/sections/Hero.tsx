"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageContext";

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
    const { t } = useLanguage();
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
        <section className="relative min-h-[65vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden py-16">
            <Image
                src="https://images.unsplash.com/photo-1638401607292-ba5ca538031e?q=80&w=1170&auto=format&fit=crop"
                alt="Disaster Relief Response"
                fill
                priority
                className="object-cover"
            />
            {/* Dark overlay so white text stays readable over any photo */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80" />

            <div className="relative max-w-4xl mx-auto">
                <span className="mb-4 inline-block px-3.5 py-1 rounded-full bg-red-600/90 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur shadow-sm">
                    {t("hero.badge")}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
                    {t("hero.title")}
                </h1>
                <p className="mt-4 text-white/90 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                    {t("hero.subtitle")}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Link href="/missions/add"><Button size="lg">{t("hero.post")}</Button></Link>
                    <Link href="/explore"><Button variant="outline" size="lg" className="bg-white/90 hover:bg-white text-neutral-900 border-none font-semibold">{t("hero.explore")}</Button></Link>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/20 pt-8">
                    <div>
                        <p className="text-2xl md:text-4xl font-bold text-white">{volunteers}+</p>
                        <p className="text-xs md:text-sm text-white/80 mt-1">Volunteers Joined</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-4xl font-bold text-white">{missions}</p>
                        <p className="text-xs md:text-sm text-white/80 mt-1">Active Response Missions</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-4xl font-bold text-white">{success}%</p>
                        <p className="text-xs md:text-sm text-white/80 mt-1">Response Success Rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
}