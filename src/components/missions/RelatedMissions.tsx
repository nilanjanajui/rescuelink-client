import Link from "next/link";
import Image from "next/image";
import type { Mission } from "@/types/mission";

export default function RelatedMissions({ missions }: { missions: Mission[] }) {
    if (missions.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Other Urgent Missions</h3>
            <div className="space-y-3">
                {missions.map((m) => (
                    <Link key={m._id} href={`/missions/${m._id}`} className="flex gap-3 group">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                            <Image src={m.imageUrl} alt={m.title} fill className="object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900 group-hover:text-primary">{m.title}</p>
                            <p className="text-xs text-neutral-600">{m.shortDescription}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}