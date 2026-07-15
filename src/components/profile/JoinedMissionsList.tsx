"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { apiFetch, ApiError } from "@/lib/api";
import type { JoinedMission } from "@/types/mission";

export default function JoinedMissionsList() {
    const [joined, setJoined] = useState<JoinedMission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<{ joined: JoinedMission[] }>("/volunteer-signups/mine")
            .then((data) => setJoined(data.joined))
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

    if (joined.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-sm text-neutral-600 mb-4">You haven&apos;t joined any missions yet.</p>
                <Link href="/explore" className="text-primary text-sm font-medium hover:underline">
                    Find a mission to join →
                </Link>
            </div>
        );
    }

    return (
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
    );
}