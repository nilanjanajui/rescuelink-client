import { timeAgo } from "@/lib/format";
import type { MissionUpdate } from "@/types/mission";

export default function UpdatesFeed({ updates }: { updates: MissionUpdate[] }) {
    if (updates.length === 0) {
        return <p className="text-sm text-neutral-600">No updates posted yet.</p>;
    }

    return (
        <div className="space-y-4">
            {updates.map((update) => (
                <div key={update._id} className="bg-neutral-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold">
                                {update.authorName[0]?.toUpperCase()}
                            </span>
                            <span className="font-medium text-sm text-neutral-900">{update.authorName}</span>
                        </div>
                        <span className="text-xs text-neutral-500">{timeAgo(update.createdAt)}</span>
                    </div>
                    <p className="text-sm text-neutral-700 pl-10">{update.message}</p>
                </div>
            ))}
        </div>
    );
}