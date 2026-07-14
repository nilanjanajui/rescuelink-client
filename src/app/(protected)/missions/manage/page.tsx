"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Modal from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";
import type { Mission } from "@/types/mission";

export default function ManageMissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);

    const load = () => {
        apiFetch<{ missions: Mission[] }>("/missions/mine")
            .then((data) => setMissions(data.missions))
            .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load your missions."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const handleToggleStatus = async (mission: Mission) => {
        setBusyId(mission._id);
        const nextStatus = mission.status === "active" ? "resolved" : "active";
        try {
            await apiFetch(`/missions/${mission._id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
            });
            setMissions((prev) =>
                prev.map((m) => (m._id === mission._id ? { ...m, status: nextStatus } : m))
            );
        } catch {
            setError("Failed to update mission status.");
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async () => {
        if (!pendingDeleteId) return;
        setBusyId(pendingDeleteId);
        try {
            await apiFetch(`/missions/${pendingDeleteId}`, { method: "DELETE" });
            setMissions((prev) => prev.filter((m) => m._id !== pendingDeleteId));
        } catch {
            setError("Failed to delete mission.");
        } finally {
            setBusyId(null);
            setPendingDeleteId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Manage Missions</h1>
                    <p className="text-neutral-600 mt-1">Missions you&apos;ve posted.</p>
                </div>
                <Link href="/missions/add">
                    <Button>+ New Mission</Button>
                </Link>
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-20" />
                    ))}
                </div>
            ) : missions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
                    <p className="text-neutral-600 mb-4">You haven&apos;t posted any missions yet.</p>
                    <Link href="/missions/add">
                        <Button>Post Your First Mission</Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 text-left text-neutral-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Mission</th>
                                    <th className="px-4 py-3 font-medium">Location</th>
                                    <th className="px-4 py-3 font-medium">Urgency</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Volunteers</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missions.map((mission) => (
                                    <tr key={mission._id} className="border-t border-neutral-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                    <Image src={mission.imageUrl} alt={mission.title} fill className="object-cover" />
                                                </div>
                                                <span className="font-medium text-neutral-900">{mission.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-600">{mission.location}</td>
                                        <td className="px-4 py-3"><Badge variant={mission.urgency}>{mission.urgency}</Badge></td>
                                        <td className="px-4 py-3"><Badge variant={mission.status}>{mission.status}</Badge></td>
                                        <td className="px-4 py-3 text-neutral-600">{mission.volunteersJoined}/{mission.volunteersNeeded}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/missions/${mission._id}`}>
                                                    <Button variant="outline" size="sm">View</Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={busyId === mission._id}
                                                    onClick={() => handleToggleStatus(mission)}
                                                >
                                                    {mission.status === "active" ? "Mark Resolved" : "Reopen"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={busyId === mission._id}
                                                    onClick={() => setPendingDeleteId(mission._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="md:hidden space-y-4">
                        {missions.map((mission) => (
                            <div key={mission._id} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
                                <div className="flex gap-3 mb-3">
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                        <Image src={mission.imageUrl} alt={mission.title} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">{mission.title}</p>
                                        <p className="text-sm text-neutral-600">{mission.location}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    <Badge variant={mission.urgency}>{mission.urgency}</Badge>
                                    <Badge variant={mission.status}>{mission.status}</Badge>
                                </div>
                                <p className="text-sm text-neutral-600 mb-3">
                                    {mission.volunteersJoined}/{mission.volunteersNeeded} volunteers
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/missions/${mission._id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">View</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        disabled={busyId === mission._id}
                                        onClick={() => handleToggleStatus(mission)}
                                    >
                                        {mission.status === "active" ? "Resolve" : "Reopen"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        disabled={busyId === mission._id}
                                        onClick={() => setPendingDeleteId(mission._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <Modal open={!!pendingDeleteId} onClose={() => setPendingDeleteId(null)} title="Delete this mission?">
                <p className="text-sm text-neutral-600 mb-6">
                    This permanently removes the mission along with its volunteer signups and updates. This can&apos;t be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
                    <Button onClick={handleDelete} disabled={busyId === pendingDeleteId}>
                        {busyId === pendingDeleteId ? "Deleting..." : "Delete Mission"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}