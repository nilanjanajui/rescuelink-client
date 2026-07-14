import type { SVGProps } from "react";

type Org = {
    name: string;
    focus: string;
    accent: string;
    Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

function CrescentIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M15.5 3.5a8 8 0 1 0 5 7.2c0-.3-.3-.5-.6-.4A6 6 0 0 1 12 4.5c0-.3.1-.6.4-.7.3-.1.2-.4-.1-.4Z" />
            <path d="M12 9.5v4M10 11.5h4" />
        </svg>
    );
}

function ChildShieldIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3 5 5.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5L12 3Z" />
            <circle cx="12" cy="10" r="1.8" />
            <path d="M9 15c0-1.7 1.3-2.5 3-2.5s3 .8 3 2.5" />
        </svg>
    );
}

function GlobePulseIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h5l1.5-3 2 6 1.5-3h6.5" />
        </svg>
    );
}

function HandsIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3.5 13.5 7 11l3 1.3" />
            <path d="M20.5 13.5 17 11l-3 1.3" />
            <path d="M7 11V6.8a1.3 1.3 0 0 1 2.6 0V10" />
            <path d="M9.6 10V5.6a1.3 1.3 0 0 1 2.6 0V10" />
            <path d="M12.2 10V6.3a1.3 1.3 0 0 1 2.6 0V11" />
            <path d="M14.8 11.2v-3a1.3 1.3 0 0 1 2.6 0V13" />
            <path d="M7 11c-.3 3 1 5.3 5 5.3s5.3-2.3 5-5.3" />
        </svg>
    );
}

function WaveLeafIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
            <path d="M3 20c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
            <path d="M15 4c-3 1-4 4-2.5 8" />
        </svg>
    );
}

const orgs: Org[] = [
    { name: "Red Crescent", focus: "Emergency medical response", accent: "var(--color-primary)", Icon: CrescentIcon },
    { name: "UNICEF", focus: "Child welfare & protection", accent: "var(--color-accent)", Icon: ChildShieldIcon },
    { name: "WHO", focus: "Global health coordination", accent: "var(--color-warning)", Icon: GlobePulseIcon },
    { name: "Mercy Corps", focus: "Community resilience programs", accent: "var(--color-primary-dark)", Icon: HandsIcon },
    { name: "Ocean Cleanup", focus: "Environmental disaster recovery", accent: "var(--color-accent)", Icon: WaveLeafIcon },
];

export default function Partners() {
    return (
        <section className="bg-neutral-50 px-4 md:px-8 py-16 border-y border-neutral-100">
            <div className="max-w-6xl mx-auto">
                <p className="text-center text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                    Our Inspiration
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-2">
                    Modeled on real-world relief work
                </h2>
                <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-10">
                    RescueLink is a student-built platform inspired by the coordination work of
                    organizations like these. It is not an official partner, affiliate, or
                    integration of any group named below.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {orgs.map(({ name, focus, accent, Icon }) => (
                        <div
                            key={name}
                            className="group bg-white rounded-xl border border-neutral-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                            <span
                                className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
                                style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, white)`, color: accent }}
                            >
                                <Icon className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="font-medium text-sm text-neutral-900">{name}</p>
                                <p className="text-xs text-neutral-600 mt-0.5">{focus}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}