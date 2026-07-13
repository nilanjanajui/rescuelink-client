import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
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
            className="bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <div className="relative h-40 w-full">
                <Image src={mission.imageUrl} alt={mission.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                    <Badge variant={mission.urgency}>{mission.urgency}</Badge>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-neutral-900">{mission.title}</h3>
                <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1">
                    <span>📍</span> {mission.location}
                </p>

                <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                        <span>VOLUNTEERS FILLED</span>
                        <span className="text-neutral-900">{percentFilled}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                            className={`h-full ${urgencyColor(mission.urgency)}`}
                            style={{ width: `${percentFilled}%` }}
                        />
                    </div>
                </div>

                <span className="mt-4 w-full inline-block text-center rounded-xl bg-primary text-white font-medium py-2.5 hover:bg-primary-dark transition-colors">
                    View Mission
                </span>
            </div>
        </Link>
    );
}