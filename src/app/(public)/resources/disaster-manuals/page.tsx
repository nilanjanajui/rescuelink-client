import Card from "@/components/ui/Card";

export const metadata = { title: "Disaster Manuals — RescueLink" };

const MANUALS = [
    {
        type: "Flood",
        icon: "💧",
        tips: [
            "Move to higher ground immediately if flash flood warnings are issued — don't wait to see how high water rises.",
            "Avoid walking or driving through moving water; 15cm can knock an adult off their feet.",
            "Disconnect electrical appliances if water is entering a building, but only if you can do so safely.",
            "After a flood, boil or treat all drinking water until authorities confirm the supply is safe.",
        ],
    },
    {
        type: "Fire",
        icon: "🔥",
        tips: [
            "Have two ways out of every room and a family meeting point outside.",
            "Stay low to the ground when moving through smoke — cleaner air is near the floor.",
            "Never re-enter a burning building for belongings.",
            "For wildfires, keep vehicles fueled and pointed toward the exit route during fire season.",
        ],
    },
    {
        type: "Earthquake",
        icon: "🌋",
        tips: [
            "Drop, Cover, and Hold On — get under sturdy furniture and protect your head and neck.",
            "Stay indoors until shaking stops, then check for gas leaks and structural damage before re-entering.",
            "Keep heavy objects on lower shelves to reduce falling hazards.",
            "After a major quake, expect aftershocks and avoid damaged structures.",
        ],
    },
    {
        type: "Cyclone",
        icon: "🌀",
        tips: [
            "Follow official evacuation orders early — roads can become impassable quickly.",
            "Secure or bring in loose outdoor items that could become projectiles in high wind.",
            "Stock at least 72 hours of water, food, and medication before a storm's expected arrival.",
            "Stay away from windows during the storm; shelter in an interior room on the lowest safe floor.",
        ],
    },
];

export default function DisasterManualsPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Disaster Manuals</h1>
                <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                    General preparedness and safety guidance by disaster type. These are starting points —
                    always follow instructions from local authorities and emergency services during an
                    active event.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MANUALS.map((manual) => (
                    <Card key={manual.type}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{manual.icon}</span>
                            <h2 className="font-semibold text-lg text-neutral-900">{manual.type} Safety</h2>
                        </div>
                        <ul className="space-y-2">
                            {manual.tips.map((tip, i) => (
                                <li key={i} className="text-sm text-neutral-700 flex gap-2">
                                    <span className="text-primary shrink-0">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            <p className="text-center text-sm text-neutral-500 mt-10">
                Volunteering on a mission? Check that mission&apos;s Overview and Updates feed for
                situation-specific guidance from the organizing team.
            </p>
        </div>
    );
}