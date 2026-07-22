"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { apiFetch } from "@/lib/api";
import type { Mission } from "@/types/mission";

export default function AIRecommendations() {
    const [recommendations, setRecommendations] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        apiFetch<{ recommendations: Mission[] }>("/recommendations")
            .then((data) => setRecommendations(data.recommendations ?? []))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                    <span className="animate-spin text-lg">🤖</span>
                    <p className="text-sm font-semibold text-neutral-700">Groq AI is analyzing volunteer skills & matching missions...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-44 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || recommendations.length === 0) return null;

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-cyan-50/90 border border-emerald-200/80 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🤖</span>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                            AI-Matched Missions For You
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                AI Powered
                            </span>
                        </h2>
                        <p className="text-xs text-neutral-600">
                            Smart recommendations tailored to your skills & location using Groq AI & Adzuna Network
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
                    <span>⚡ Powered by Groq & Adzuna</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.slice(0, 3).map((mission) => {
                    const isExternal = mission.source === "Adzuna";
                    const targetUrl = isExternal && mission.redirectUrl ? mission.redirectUrl : `/missions/${mission._id}`;

                    return (
                        <div
                            key={mission._id}
                            className="bg-white rounded-xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                        >
                            <div className="relative h-28 w-full bg-neutral-100 shrink-0">
                                <Image
                                    src={mission.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800"}
                                    alt={mission.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                                    <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                        ✨ {mission.aiMatchScore ?? 85}% Match
                                    </span>
                                    <Badge variant={mission.urgency}>{mission.urgency}</Badge>
                                </div>
                                {isExternal && (
                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                        Adzuna External
                                    </span>
                                )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                    <h3 className="font-bold text-sm text-neutral-900 line-clamp-1 mb-1">{mission.title}</h3>
                                    <p className="text-xs text-neutral-500 mb-2 font-medium">📍 {mission.location}</p>
                                    <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-lg leading-snug">
                                        💡 {mission.aiMatchReason || "Matches your volunteer skills."}
                                    </p>
                                </div>

                                {isExternal ? (
                                    <a
                                        href={targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                                    >
                                        Apply on Adzuna ↗
                                    </a>
                                ) : (
                                    <Link
                                        href={targetUrl}
                                        className="w-full inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                                    >
                                        View & Join Mission →
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
