import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata = {
    title: "About — RescueLink",
    description: "Why RescueLink exists and how it connects volunteers to disaster relief missions.",
};

export default function AboutPage() {
    return (
        <div>
            <section className="bg-linear-to-b from-red-50 to-white px-4 md:px-8 py-20 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 max-w-2xl mx-auto">
                    Coordination shouldn&apos;t be the bottleneck in a crisis.
                </h1>
                <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
                    RescueLink connects local responders, volunteers, and organizations with the missions
                    that need them most — in real time, without the spreadsheets and phone trees.
                </p>
            </section>

            <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Why we exist</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                    After a flood, fire, or earthquake, the hardest problem often isn&apos;t a lack of
                    willing volunteers or available supplies — it&apos;s getting the right people to the
                    right place before the window to help closes. Relief organizations post needs across
                    scattered channels, and volunteers have no single place to find verified, urgent
                    missions near them.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                    RescueLink is a single coordination layer: organizations post missions with real
                    urgency levels and volunteer targets, and anyone can find, join, and track progress
                    on a mission from sign-up to resolution.
                </p>
            </section>

            <section className="bg-neutral-50 px-4 md:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <span className="text-2xl">🚨</span>
                            <h3 className="font-semibold text-neutral-900 mt-3 mb-2">1. Report</h3>
                            <p className="text-sm text-neutral-600">
                                Organizations and coordinators post missions with disaster type, urgency,
                                location, and how many volunteers are needed.
                            </p>
                        </Card>
                        <Card>
                            <span className="text-2xl">🤝</span>
                            <h3 className="font-semibold text-neutral-900 mt-3 mb-2">2. Volunteer</h3>
                            <p className="text-sm text-neutral-600">
                                Anyone can browse active missions, filter by what&apos;s most urgent, and
                                join with one click.
                            </p>
                        </Card>
                        <Card>
                            <span className="text-2xl">📡</span>
                            <h3 className="font-semibold text-neutral-900 mt-3 mb-2">3. Track</h3>
                            <p className="text-sm text-neutral-600">
                                Live progress bars and status updates keep everyone — volunteers,
                                coordinators, and the public — on the same page until a mission resolves.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="max-w-2xl mx-auto px-4 md:px-8 py-16 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">Want to help?</h2>
                <p className="text-neutral-600 mb-6">
                    Browse active missions and join one, or reach out if you&apos;re an organization
                    looking to coordinate relief efforts on RescueLink.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link href="/explore"><Button>Find Missions</Button></Link>
                    <Link href="/contact"><Button variant="outline">Contact Us</Button></Link>
                </div>
            </section>
        </div>
    );
}