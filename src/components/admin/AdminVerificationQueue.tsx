"use client";

import React, { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import Button from "@/components/ui/Button";

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

export default function AdminVerificationQueue() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await apiFetch<{ users: AdminUser[] }>("/admin/users");
            setUsers(data.users);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load moderation queue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleVerify = async (userId: string, currentStatus: boolean) => {
        setActionId(userId);
        try {
            await apiFetch<{ isVerified: boolean }>(`/admin/users/${userId}/verify`, {
                method: "PATCH",
                body: JSON.stringify({ isVerified: !currentStatus }),
            });

            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, isVerified: !currentStatus } : u))
            );
        } catch (err) {
            alert("Failed to update verification status.");
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-neutral-500">Loading moderation queue...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-lg text-neutral-900">Organization & User Moderation Queue</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Approve disaster response organizations to display the verified checkmark badge on missions.
                    </p>
                </div>
            </div>

            <div className="divide-y divide-neutral-100">
                {users.map((user) => (
                    <div key={user._id} className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-neutral-900">{user.name}</span>
                                    {user.isVerified && <VerifiedBadge />}
                                </div>
                                <p className="text-xs text-neutral-500">{user.email} · Role: {user.role}</p>
                            </div>
                        </div>

                        <Button
                            variant={user.isVerified ? "outline" : "primary"}
                            size="sm"
                            disabled={actionId === user._id}
                            onClick={() => toggleVerify(user._id, user.isVerified)}
                        >
                            {actionId === user._id
                                ? "Updating..."
                                : user.isVerified
                                ? "Revoke Verification"
                                : "✓ Approve & Verify"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
