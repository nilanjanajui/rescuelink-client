"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

type Mission = {
    _id: string;
    title: string;
    shortDescription: string;
    disasterType: string;
    urgency: "critical" | "moderate" | "low";
    status: "active" | "resolved";
    location: string;
    volunteersNeeded: number;
    volunteersJoined: number;
    imageUrl: string;
};

export default function FeaturedMissions() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions?limit=4&status=active`)
            .then((res) => res.json())
            .then((data) => setMissions(data.missions ?? data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Featured Missions</h2>
                <Link href="/explore" className="text-primary text-sm font-medium">View All Missions →</Link>
            </div>
            <p className="text-neutral-600 mb-8">Urgent relief operations requiring immediate assistance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)
                    : missions.map((m) => (
                        <Link
                            key={m._id}
                            href={`/missions/${m._id}`}
                            className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
                        >
                            <div className="relative h-64 w-full">
                                <Image src={m.imageUrl} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                            </div>
                            <div className="absolute top-3 left-3">
                                <Badge variant={m.status === "active" ? "active" : "resolved"}>
                                    {m.status === "active" ? "Active Now" : "Resolved"}
                                </Badge>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="font-semibold">{m.title}</h3>
                                <p className="text-xs text-white/80 line-clamp-1">{m.shortDescription}</p>
                                <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent"
                                        style={{ width: `${Math.min(100, (m.volunteersJoined / m.volunteersNeeded) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </section>
    );
}