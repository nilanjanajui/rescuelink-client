"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import JoinMissionButton from "@/components/missions/JoinMissionButton";
import UpdatesFeed from "@/components/missions/UpdatesFeed";
import RelatedMissions from "@/components/missions/RelatedMissions";
import Button from "@/components/ui/Button";
import { timeAgo, urgencyColor } from "@/lib/format";
import { useSocket } from "@/components/providers/SocketProvider";
import { authClient } from "@/lib/auth-client";
import { apiFetch, ApiError } from "@/lib/api";
import type { Mission, MissionUpdate } from "@/types/mission";

interface MissionDetailInteractiveProps {
    initialMission: Mission;
    initialUpdates: MissionUpdate[];
    relatedMissions: Mission[];
}

export default function MissionDetailInteractive({
    initialMission,
    initialUpdates,
    relatedMissions,
}: MissionDetailInteractiveProps) {
    const { socket } = useSocket();
    const { data: session } = authClient.useSession();

    const [mission, setMission] = useState<Mission>(initialMission);
    const [updates, setUpdates] = useState<MissionUpdate[]>(initialUpdates);
    const [viewerCount, setViewerCount] = useState<number>(1);
    const [updateMessage, setUpdateMessage] = useState("");
    const [postingUpdate, setPostingUpdate] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const isPoster = session?.user?.id === mission.postedBy;
    const isAdmin = session?.user?.role === "admin";
    const canPostUpdate = isPoster || isAdmin;

    // Join mission socket room and listen for real-time updates
    useEffect(() => {
        if (!socket || !mission._id) return;

        socket.emit("join_mission", mission._id);

        const handleViewerCount = (data: { missionId: string; count: number }) => {
            if (data.missionId === mission._id) {
                setViewerCount(data.count);
            }
        };

        const handleMissionUpdated = (data: { missionId: string; volunteersJoined: number }) => {
            if (data.missionId === mission._id) {
                setMission((prev) => ({ ...prev, volunteersJoined: data.volunteersJoined }));
            }
        };

        const handleUpdateAdded = (data: { missionId: string; update: MissionUpdate }) => {
            if (data.missionId === mission._id) {
                setUpdates((prev) => [data.update, ...prev]);
            }
        };

        socket.on("viewers_count", handleViewerCount);
        socket.on("mission:updated", handleMissionUpdated);
        socket.on("update:added", handleUpdateAdded);

        return () => {
            socket.emit("leave_mission", mission._id);
            socket.off("viewers_count", handleViewerCount);
            socket.off("mission:updated", handleMissionUpdated);
            socket.off("update:added", handleUpdateAdded);
        };
    }, [socket, mission._id]);

    const handlePostUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateMessage.trim()) return;

        setPostingUpdate(true);
        setUpdateError(null);

        try {
            const data = await apiFetch<{ update: MissionUpdate }>("/updates", {
                method: "POST",
                body: JSON.stringify({ missionId: mission._id, message: updateMessage.trim() }),
            });
            setUpdateMessage("");
        } catch (err) {
            setUpdateError(err instanceof ApiError ? err.message : "Failed to post update.");
        } finally {
            setPostingUpdate(false);
        }
    };

    const percentFilled = Math.min(
        100,
        Math.round((mission.volunteersJoined / Math.max(1, mission.volunteersNeeded)) * 100)
    );

    return (
        <div>
            {/* Hero Banner */}
            <div className="relative h-100 w-full">
                <Image src={mission.imageUrl} alt={mission.title} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20" />

                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-10 text-white">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant={mission.urgency}>{mission.urgency} urgency</Badge>
                        <Badge variant={mission.status}>{mission.status} mission</Badge>

                        {/* Live active viewers badge */}
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            {viewerCount} {viewerCount === 1 ? "person" : "people"} viewing this mission right now
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm text-neutral-300 font-medium">{mission.posterName || "Organization"}</span>
                        {mission.isVerified && <VerifiedBadge />}
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold max-w-3xl">{mission.title}</h1>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
                        <span>📍 {mission.location}</span>
                        <span>🗓 Posted {timeAgo(mission.createdAt)}</span>
                        {mission.estimatedHours && <span>⏱ Est. {mission.estimatedHours} Hours</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h2 className="font-semibold text-lg text-neutral-900 mb-3">Mission Overview</h2>
                        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{mission.fullDescription}</p>
                    </div>

                    {mission.images && mission.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {mission.images.map((src, i) => (
                                <div key={i} className="relative h-32 md:h-40 rounded-xl overflow-hidden border border-neutral-100">
                                    <Image src={src} alt={`${mission.title} photo ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Live Updates Section */}
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-lg text-neutral-900 flex items-center gap-2">
                                <span>Volunteer Activity & Updates</span>
                                <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                                    Live
                                </span>
                            </h2>
                        </div>

                        {/* Form for posting update if poster or admin */}
                        {canPostUpdate && (
                            <form onSubmit={handlePostUpdate} className="mb-6 bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                                    Post Mission Progress Update
                                </label>
                                <textarea
                                    value={updateMessage}
                                    onChange={(e) => setUpdateMessage(e.target.value)}
                                    placeholder="Share real-time status, supply needs, or field reports with volunteers..."
                                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-20 bg-white"
                                    required
                                />
                                {updateError && <p className="text-xs text-red-600">{updateError}</p>}
                                <Button type="submit" size="sm" disabled={postingUpdate}>
                                    {postingUpdate ? "Posting..." : "Broadcast Update to Volunteers"}
                                </Button>
                            </form>
                        )}

                        <UpdatesFeed updates={updates} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border-2 border-primary shadow-sm p-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">RECRUITMENT PROGRESS</span>
                            <span className="text-lg font-bold text-primary">{percentFilled}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-neutral-200 overflow-hidden mb-2">
                            <div
                                className={`h-full transition-all duration-500 ${urgencyColor(mission.urgency)}`}
                                style={{ width: `${percentFilled}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-neutral-600 mb-6 font-medium">
                            <span className="text-neutral-900 font-semibold">{mission.volunteersJoined} volunteers joined</span>
                            <span>Target: {mission.volunteersNeeded}</span>
                        </div>

                        <dl className="space-y-3 text-sm mb-6 border-t border-neutral-100 pt-4">
                            <div>
                                <dt className="text-neutral-500 text-xs uppercase font-medium">Disaster Type</dt>
                                <dd className="text-neutral-900 font-medium capitalize">{mission.disasterType}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-500 text-xs uppercase font-medium">Urgency Level</dt>
                                <dd className="text-neutral-900 font-medium capitalize">{mission.urgency}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-500 text-xs uppercase font-medium">Location</dt>
                                <dd className="text-neutral-900 font-medium">{mission.location}</dd>
                            </div>
                            {mission.estimatedHours && (
                                <div>
                                    <dt className="text-neutral-500 text-xs uppercase font-medium">Estimated Volunteer Contribution</dt>
                                    <dd className="text-neutral-900 font-medium">{mission.estimatedHours} Hours per Volunteer</dd>
                                </div>
                            )}
                        </dl>

                        <JoinMissionButton missionId={mission._id} initialVolunteersJoined={mission.volunteersJoined} />
                    </div>

                    <RelatedMissions missions={relatedMissions} />
                </div>
            </div>
        </div>
    );
}
