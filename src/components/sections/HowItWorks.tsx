import Card from "@/components/ui/Card";

const steps = [
    { icon: "🚨", title: "Report", desc: "Instantly report disasters with geo-tagged data, photos, and priority assessments to alert the nearest response teams." },
    { icon: "🤝", title: "Volunteer", desc: "Join vetted missions tailored to your skills, whether medical, logistics, or general labor, through our secure platform." },
    { icon: "🚚", title: "Deliver Relief", desc: "Coordinate the last-mile delivery of essential supplies like food, water, and medicine to the communities that need it most." },
];

export default function HowItWorks() {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 inline-block relative">
                    How It Works
                    <span className="block w-12 h-1 bg-primary mx-auto mt-2 rounded-full" />
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step) => (
                    <Card key={step.title} className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl mx-auto mb-4">
                            {step.icon}
                        </div>
                        <h3 className="font-semibold text-neutral-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-neutral-600">{step.desc}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}