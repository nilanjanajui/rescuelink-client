import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import type { Mission } from "@/types/mission";
import { urgencyColor } from "@/lib/format";

export default function MissionCard({ mission }: { mission: Mission }) {
    const percentFilled = Math.min(
        100,
        Math.round((mission.volunteersJoined / Math.max(1, mission.volunteersNeeded)) * 100)
    );

    return (
        <Link
            href={`/missions/${mission._id}`}
            className="bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
        >
            <div className="relative h-44 w-full overflow-hidden">
                <Image
                    src={mission.imageUrl}
                    alt={mission.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <Badge variant={mission.urgency}>{mission.urgency}</Badge>
                    {mission.estimatedHours && (
                        <span className="bg-black/60 backdrop-blur text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            ⏱ {mission.estimatedHours}h est.
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-xs text-neutral-500 font-medium truncate">
                        {mission.posterName || "Organization"}
                    </span>
                    {mission.isVerified && <VerifiedBadge />}
                </div>

                <h3 className="font-semibold text-neutral-900 leading-snug line-clamp-2">{mission.title}</h3>

                <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                    <span>📍</span> {mission.location}
                </p>

                <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                        <span>VOLUNTEERS FILLED</span>
                        <span className="text-neutral-900">{mission.volunteersJoined} / {mission.volunteersNeeded} ({percentFilled}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                            className={`h-full ${urgencyColor(mission.urgency)}`}
                            style={{ width: `${percentFilled}%` }}
                        />
                    </div>
                </div>

                <span className="mt-4 w-full inline-block text-center rounded-xl bg-primary text-white text-sm font-medium py-2.5 hover:bg-primary-dark transition-colors">
                    View Mission
                </span>
            </div>
        </Link>
    );
}