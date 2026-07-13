"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch, ApiError } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function JoinMissionButton({
    missionId,
    initialVolunteersJoined,
}: {
    missionId: string;
    initialVolunteersJoined: number;
}) {
    const { data: session, isPending } = authClient.useSession();
    const [joined, setJoined] = useState(false);
    const [volunteersJoined, setVolunteersJoined] = useState(initialVolunteersJoined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    const isTenant = session?.user?.role === "Tenant";
    const isEligible = !!session && !isTenant;

    useEffect(() => {
        if (!isEligible) return;
        apiFetch<{ joined: boolean }>(`/volunteer-signups/status?missionId=${missionId}`)
            .then((data) => setJoined(data.joined))
            .catch(() => { })
            .finally(() => setChecked(true));
    }, [isEligible, missionId]);

    const handleJoin = async () => {
        setError(null);
        setLoading(true);
        try {
            const data = await apiFetch<{ joined: boolean; volunteersJoined: number }>("/volunteer-signups", {
                method: "POST",
                body: JSON.stringify({ missionId }),
            });
            setJoined(true);
            setVolunteersJoined(data.volunteersJoined);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return <div className="h-11 rounded-xl bg-neutral-100 animate-pulse" />;
    }

    if (!session) {
        return (
            <Link href="/login">
                <Button className="w-full">Log In to Join</Button>
            </Link>
        );
    }

    if (isTenant) {
        return (
            <p className="text-sm text-neutral-600 text-center border border-neutral-200 rounded-xl py-3 px-4">
                Browse-only accounts can&apos;t join missions.
            </p>
        );
    }

    if (!checked) {
        return <div className="h-11 rounded-xl bg-neutral-100 animate-pulse" />;
    }

    if (joined) {
        return (
            <Button className="w-full" disabled variant="outline">
                ✓ You&apos;ve Joined ({volunteersJoined} total)
            </Button>
        );
    }

    return (
        <div>
            <Button className="w-full" onClick={handleJoin} disabled={loading}>
                {loading ? "Joining..." : "Join Mission"}
            </Button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
    );
}