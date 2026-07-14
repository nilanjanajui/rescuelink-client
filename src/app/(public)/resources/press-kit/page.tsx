import Card from "@/components/ui/Card";

export const metadata = { title: "Press Kit — RescueLink" };

export default function PressKitPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Press Kit</h1>
                <p className="text-neutral-600 mt-2">Background information for journalists and media partners.</p>
            </div>

            <Card className="mb-6">
                <h2 className="font-semibold text-neutral-900 mb-2">About RescueLink</h2>
                <p className="text-neutral-700 leading-relaxed text-sm">
                    RescueLink is a disaster relief coordination platform that connects volunteers,
                    organizations, and first responders with active relief missions in real time. Rather
                    than relying on scattered phone trees and spreadsheets, organizations post missions
                    with urgency levels and volunteer needs, and anyone can find and join the ones that
                    match their skills and location.
                </p>
            </Card>

            <Card className="mb-6">
                <h2 className="font-semibold text-neutral-900 mb-2">Boilerplate</h2>
                <p className="text-neutral-700 leading-relaxed text-sm">
                    RescueLink is a disaster relief coordination platform connecting volunteers and
                    organizations with active relief missions worldwide. Learn more at rescuelink.org.
                </p>
            </Card>

            <Card className="mb-6">
                <h2 className="font-semibold text-neutral-900 mb-2">Brand</h2>
                <p className="text-neutral-700 leading-relaxed text-sm mb-4">
                    Our brand uses a deep crimson as the primary color (urgency and action), teal as an
                    accent (trust and calm), and amber for warning/status indicators.
                </p>
                <div className="flex gap-3">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-primary mb-1" />
                        <p className="text-xs text-neutral-600">#DC2626</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-accent mb-1" />
                        <p className="text-xs text-neutral-600">#0D9488</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-warning mb-1" />
                        <p className="text-xs text-neutral-600">#D97706</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="font-semibold text-neutral-900 mb-2">Media Contact</h2>
                <p className="text-neutral-700 text-sm">
                    For interviews, data requests, or further information, reach out to{" "}
                    <a href="mailto:press@rescuelink.org" className="text-primary hover:underline">
                        press@rescuelink.org
                    </a>.
                </p>
            </Card>
        </div>
    );
}