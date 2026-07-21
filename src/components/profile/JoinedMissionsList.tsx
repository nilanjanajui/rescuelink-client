"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import ImpactBadges, { BadgeItem } from "@/components/profile/ImpactBadges";
import { apiFetch, ApiError } from "@/lib/api";
import type { JoinedMission } from "@/types/mission";

export default function JoinedMissionsList() {
    const [joined, setJoined] = useState<JoinedMission[]>([]);
    const [stats, setStats] = useState<{ totalMissions: number; totalHours: number }>({
        totalMissions: 0,
        totalHours: 0,
    });
    const [badges, setBadges] = useState<BadgeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<{
            joined: JoinedMission[];
            stats: { totalMissions: number; totalHours: number };
            badges: BadgeItem[];
        }>("/volunteer-signups/mine")
            .then((data) => {
                setJoined(data.joined || []);
                setStats(data.stats || { totalMissions: 0, totalHours: 0 });
                setBadges(data.badges || []);
            })
            .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load your missions."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
        );
    }

    if (error) {
        return <p className="text-sm text-neutral-600">{error}</p>;
    }

    return (
        <div className="space-y-8">
            {/* Impact Banner */}
            <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-xl p-6 text-white shadow-md">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Volunteer Impact Summary</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                    You&apos;ve contributed an estimated <span className="underline decoration-amber-300">{stats.totalHours} hours</span> across {stats.totalMissions} missions.
                </p>
            </div>

            {/* Achievements Badges */}
            {badges.length > 0 && <ImpactBadges badges={badges} />}

            {/* Joined Missions List */}
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">Missions You&apos;ve Joined</h2>
                {joined.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-neutral-600 mb-4">You haven&apos;t joined any missions yet.</p>
                        <Link href="/explore" className="text-primary text-sm font-medium hover:underline">
                            Find a mission to join →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {joined.map((j) => (
                            <Link
                                key={j.missionId}
                                href={`/missions/${j.mission._id}`}
                                className="flex gap-3 items-center bg-neutral-50 rounded-xl p-3 hover:bg-neutral-100 transition-colors"
                            >
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                    <Image src={j.mission.imageUrl} alt={j.mission.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">{j.mission.title}</p>
                                    <p className="text-xs text-neutral-600">
                                        📍 {j.mission.location} · Joined {new Date(j.joinedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge variant={j.mission.status}>{j.mission.status}</Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}