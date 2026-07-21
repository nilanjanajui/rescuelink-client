"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import AdminVerificationQueue from "@/components/admin/AdminVerificationQueue";
import { apiFetch, ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { DashboardData } from "@/types/mission";

export default function DashboardPage() {
    const { data: session } = authClient.useSession();
    const role = session?.user?.role;
    const isTenant = role === "Tenant";
    const isAdmin = role === "admin";

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<DashboardData>("/dashboard")
            .then(setData)
            .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load your dashboard."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">
                    Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-neutral-600">
                    {isTenant
                        ? "Here's what's happening on RescueLink."
                        : "Here's an overview of your missions and volunteer activity."}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
            ) : error ? (
                <p className="text-center text-neutral-600 py-12">{error}</p>
            ) : data ? (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {!isTenant && (
                            <Card>
                                <p className="text-3xl font-bold text-neutral-900">{data.missionsPostedCount}</p>
                                <p className="text-sm text-neutral-600 mt-1">Missions you&apos;ve posted</p>
                            </Card>
                        )}
                        <Card>
                            <p className="text-3xl font-bold text-neutral-900">{data.missionsJoinedCount}</p>
                            <p className="text-sm text-neutral-600 mt-1">Missions you&apos;ve joined</p>
                        </Card>
                        {isAdmin && data.platform && (
                            <>
                                <Card>
                                    <p className="text-3xl font-bold text-neutral-900">{data.platform.totalMissions}</p>
                                    <p className="text-sm text-neutral-600 mt-1">Active missions (platform)</p>
                                </Card>
                                <Card>
                                    <p className="text-3xl font-bold text-neutral-900">{data.platform.totalVolunteers}</p>
                                    <p className="text-sm text-neutral-600 mt-1">Volunteers (platform)</p>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-3">
                        <Link href="/explore"><Button variant="outline">Explore Missions</Button></Link>
                        {!isTenant && (
                            <>
                                <Link href="/missions/add"><Button>+ Post a Mission</Button></Link>
                                <Link href="/missions/manage"><Button variant="outline">Manage Missions</Button></Link>
                            </>
                        )}
                        <Link href="/profile"><Button variant="outline">Your Volunteer Profile</Button></Link>
                    </div>

                    {/* Admin Organization Moderation Queue */}
                    {isAdmin && <AdminVerificationQueue />}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recently posted */}
                        {!isTenant && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg text-neutral-900">Recently Posted</h2>
                                    <Link href="/missions/manage" className="text-sm text-primary font-medium">Manage all →</Link>
                                </div>
                                {data.recentPostedMissions.length === 0 ? (
                                    <p className="text-sm text-neutral-600">You haven&apos;t posted any missions yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {data.recentPostedMissions.map((m) => (
                                            <Link
                                                key={m._id}
                                                href={`/missions/${m._id}`}
                                                className="flex gap-3 items-center bg-white rounded-xl border border-neutral-100 shadow-sm p-3 hover:shadow-md transition-shadow"
                                            >
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                    <Image src={m.imageUrl} alt={m.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{m.title}</p>
                                                    <p className="text-xs text-neutral-600">{m.location}</p>
                                                </div>
                                                <Badge variant={m.status}>{m.status}</Badge>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recently joined */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-lg text-neutral-900">Missions You&apos;ve Joined</h2>
                                <Link href="/profile" className="text-sm text-primary font-medium">View all →</Link>
                            </div>
                            {data.recentJoinedMissions.length === 0 ? (
                                <p className="text-sm text-neutral-600">
                                    {isTenant
                                        ? "Browse-only accounts can't join missions."
                                        : "You haven't joined any missions yet."}
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {data.recentJoinedMissions.map((j) => (
                                        <Link
                                            key={j.missionId}
                                            href={`/missions/${j.mission._id}`}
                                            className="flex gap-3 items-center bg-white rounded-xl border border-neutral-100 shadow-sm p-3 hover:shadow-md transition-shadow"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                <Image src={j.mission.imageUrl} alt={j.mission.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{j.mission.title}</p>
                                                <p className="text-xs text-neutral-600">{j.mission.location}</p>
                                            </div>
                                            <Badge variant={j.mission.status}>{j.mission.status}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}