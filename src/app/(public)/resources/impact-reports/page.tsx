"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

type Stats = { totalMissions: number; totalVolunteers: number; successRate: number };
type VolunteerGrowth = { month: string; volunteers: number };
type ByDisasterType = { disasterType: string; count: number };

const DISASTER_LABELS: Record<string, string> = {
    flood: "Flood",
    earthquake: "Earthquake",
    fire: "Fire",
    cyclone: "Cyclone",
    other: "Other",
};

export default function ImpactReportsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [growth, setGrowth] = useState<VolunteerGrowth[]>([]);
    const [byType, setByType] = useState<ByDisasterType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`).then((r) => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/volunteer-growth`).then((r) => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/by-disaster-type`).then((r) => r.json()),
        ])
            .then(([statsData, growthData, byTypeData]) => {
                setStats(statsData);
                setGrowth(growthData);
                setByType(
                    (byTypeData as ByDisasterType[]).map((d) => ({
                        ...d,
                        disasterType: DISASTER_LABELS[d.disasterType] ?? d.disasterType,
                    }))
                );
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Impact Reports</h1>
                <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                    Live numbers pulled directly from active mission data — not a static annual report.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card>
                        <p className="text-3xl font-bold text-neutral-900">{stats?.totalVolunteers ?? 0}+</p>
                        <p className="text-sm text-neutral-600 mt-1">Volunteer signups to date</p>
                    </Card>
                    <Card>
                        <p className="text-3xl font-bold text-neutral-900">{stats?.totalMissions ?? 0}</p>
                        <p className="text-sm text-neutral-600 mt-1">Currently active missions</p>
                    </Card>
                    <Card>
                        <p className="text-3xl font-bold text-neutral-900">{stats?.successRate ?? 0}%</p>
                        <p className="text-sm text-neutral-600 mt-1">Missions resolved successfully</p>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="font-semibold text-neutral-900 mb-4">Volunteer Activity — Last 6 Months</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="volunteers" fill="#DC2626" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h2 className="font-semibold text-neutral-900 mb-4">Missions by Disaster Type</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byType} layout="vertical" margin={{ left: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="disasterType" tick={{ fontSize: 12 }} width={80} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}