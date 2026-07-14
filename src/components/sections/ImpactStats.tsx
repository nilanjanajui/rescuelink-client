"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import Card from "@/components/ui/Card";

type VolunteerGrowth = { month: string; volunteers: number };

export default function ImpactStats() {
    const [data, setData] = useState<VolunteerGrowth[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/volunteer-growth`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => { });
    }, []);

    const data1 = [
        { month: "Jan", volunteers: 20, color: "#B00000" },
        { month: "Feb", volunteers: 35, color: "#E00000" },
        { month: "Mar", volunteers: 22, color: "#B00000" },
        { month: "Apr", volunteers: 45, color: "#0F766E" },
        { month: "May", volunteers: 33, color: "#C00000" },
        { month: "Jun", volunteers: 40, color: "#E00000" },
    ];



    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">Measurable Impact</h2>
                    <p className="text-neutral-600 mb-6">
                        Transparency is at the heart of everything we do. We track every dollar and every hour spent to ensure maximum efficiency in disaster relief operations.
                    </p>
                    <div className="space-y-4">
                        <Card className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">📈</span>
                            <div>
                                <p className="font-semibold text-neutral-900">40% Growth</p>
                                <p className="text-sm text-neutral-600">in volunteer network over the last 12 months.</p>
                            </div>
                        </Card>
                        <Card className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">⏱️</span>
                            <div>
                                <p className="font-semibold text-neutral-900">98% Deployment Rate</p>
                                <p className="text-sm text-neutral-600">Success in getting resources to the frontline within 48 hours.</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <Card className="h-80">
                    <p className="text-sm text-neutral-600 mb-2">Volunteer Activity - Last 6 Months</p>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data}>
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="volunteers" radius={[6, 6, 0, 0]}>
                                {data1.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </section>
    );
}