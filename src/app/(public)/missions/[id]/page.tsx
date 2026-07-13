import Image from "next/image";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import JoinMissionButton from "@/components/missions/JoinMissionButton";
import UpdatesFeed from "@/components/missions/UpdatesFeed";
import RelatedMissions from "@/components/missions/RelatedMissions";
import { timeAgo, urgencyColor } from "@/lib/format";
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

    const percentFilled = Math.min(
        100,
        Math.round((mission.volunteersJoined / Math.max(1, mission.volunteersNeeded)) * 100)
    );

    return (
        <div>
            {/* Hero banner */}
            <div className="relative h-100 w-full">
                <Image src={mission.imageUrl} alt={mission.title} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-10 text-white">
                    <div className="flex gap-2 mb-4">
                        <Badge variant={mission.urgency}>{mission.urgency} urgency</Badge>
                        <Badge variant={mission.status}>{mission.status} mission</Badge>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold max-w-2xl">{mission.title}</h1>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
                        <span>📍 {mission.location}</span>
                        <span>🗓 Posted {timeAgo(mission.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h2 className="font-semibold text-lg text-neutral-900 mb-3">Mission Overview</h2>
                        <p className="text-neutral-700 leading-relaxed">{mission.fullDescription}</p>
                    </div>

                    {mission.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {mission.images.map((src, i) => (
                                <div key={i} className="relative h-32 md:h-40 rounded-xl overflow-hidden">
                                    <Image src={src} alt={`${mission.title} photo ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h2 className="font-semibold text-lg text-neutral-900 mb-4">Volunteer Activity</h2>
                        <UpdatesFeed updates={updates} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border-2 border-primary shadow-sm p-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-neutral-600">RECRUITMENT PROGRESS</span>
                            <span className="text-lg font-bold text-primary">{percentFilled}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-200 overflow-hidden mb-2">
                            <div className={`h-full ${urgencyColor(mission.urgency)}`} style={{ width: `${percentFilled}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-neutral-600 mb-6">
                            <span>{mission.volunteersJoined} volunteers joined</span>
                            <span>Target: {mission.volunteersNeeded}</span>
                        </div>

                        <dl className="space-y-3 text-sm mb-6">
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
                        </dl>

                        <JoinMissionButton missionId={mission._id} initialVolunteersJoined={mission.volunteersJoined} />
                    </div>

                    <RelatedMissions missions={related} />
                </div>
            </div>
        </div>
    );
}