import Link from "next/link";

const categories = [
    { type: "flood", label: "Floods", icon: "💧" },
    { type: "fire", label: "Wildfires", icon: "🔥" },
    { type: "earthquake", label: "Earthquakes", icon: "🌋" },
    { type: "cyclone", label: "Hurricanes", icon: "🌀" },
    { type: "other", label: "Health", icon: "☀️" },
    { type: "other", label: "Refugees", icon: "👥" },
];

export default function DisasterCategories() {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Response Categories</h2>
            <p className="text-neutral-600 mt-2 mb-10">Specialized response teams for every type of humanitarian crisis.</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((cat, i) => (
                    <Link
                        key={i}
                        href={`/explore?disasterType=${cat.type}`}
                        className="bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow py-6 flex flex-col items-center gap-2"
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-sm font-medium text-neutral-900">{cat.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}