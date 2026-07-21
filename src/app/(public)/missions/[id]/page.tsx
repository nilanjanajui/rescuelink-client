import { notFound } from "next/navigation";
import MissionDetailInteractive from "@/components/missions/MissionDetailInteractive";
import type { Mission, MissionUpdate } from "@/types/mission";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMission(id: string): Promise<Mission | null> {
    const res = await fetch(`${API_URL}/missions/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.mission;
}

async function getUpdates(missionId: string): Promise<MissionUpdate[]> {
    const res = await fetch(`${API_URL}/updates?missionId=${missionId}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.updates ?? [];
}

async function getRelatedMissions(disasterType: string, excludeId: string): Promise<Mission[]> {
    const res = await fetch(
        `${API_URL}/missions?disasterType=${disasterType}&status=active&page=1&pageSize=4`,
        { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.missions ?? []).filter((m: Mission) => m._id !== excludeId).slice(0, 3);
}

export default async function MissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const mission = await getMission(id);

    if (!mission) notFound();

    const [updates, related] = await Promise.all([
        getUpdates(mission._id),
        getRelatedMissions(mission.disasterType, mission._id),
    ]);

    return (
        <MissionDetailInteractive
            initialMission={mission}
            initialUpdates={updates}
            relatedMissions={related}
        />
    );
}