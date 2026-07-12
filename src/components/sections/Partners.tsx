const partners = ["Red Crescent", "UNICEF", "WHO", "Mercy Corps", "Ocean Cleanup"];

export default function Partners() {
    return (
        <section className="py-10 border-y border-neutral-100 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center gap-10 text-neutral-600 text-sm font-medium">
                {partners.map((p) => (
                    <span key={p}>{p}</span>
                ))}
            </div>
        </section>
    );
}