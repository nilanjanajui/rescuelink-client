import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Mission, Testimonial } from "@/types/mission";

export const metadata = { title: "Success Stories — RescueLink" };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getResolvedMissions(): Promise<Mission[]> {
    const res = await fetch(`${API_URL}/missions?status=resolved&sort=recent&page=1&pageSize=12`, {
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.missions ?? [];
}

async function getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_URL}/testimonials`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.testimonials ?? [];
}

export default async function SuccessStoriesPage() {
    const [missions, testimonials] = await Promise.all([getResolvedMissions(), getTestimonials()]);

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Success Stories</h1>
                <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                    Missions that reached their goal — real outcomes from the RescueLink network.
                </p>
            </div>

            {missions.length === 0 ? (
                <p className="text-center text-neutral-600 py-12">
                    No resolved missions yet — check back once active missions wrap up.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {missions.map((mission) => (
                        <Link
                            key={mission._id}
                            href={`/missions/${mission._id}`}
                            className="bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="relative h-36 w-full">
                                <Image src={mission.imageUrl} alt={mission.title} fill className="object-cover" />
                                <div className="absolute top-3 left-3">
                                    <Badge variant="resolved">resolved</Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-neutral-900">{mission.title}</h3>
                                <p className="text-sm text-neutral-600 mt-1">📍 {mission.location}</p>
                                <p className="text-sm text-neutral-600 mt-2">
                                    {mission.volunteersJoined} volunteers mobilized
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {testimonials.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">In Their Words</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t) => (
                            <div key={t._id} className="bg-neutral-50 rounded-xl p-6">
                                <p className="text-neutral-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                        <Image src={t.avatarUrl} alt={t.authorName} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-neutral-900">{t.authorName}</p>
                                        <p className="text-xs text-neutral-600">{t.authorRole}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}