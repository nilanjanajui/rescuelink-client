import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-100 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <p className="font-bold text-primary mb-2">🛟 RescueLink</p>
                    <p className="text-sm text-neutral-600">Rapid response and logistical support for disaster zones worldwide. Empowering communities to rebuild.</p>
                </div>
                <div>
                    <p className="font-semibold text-neutral-900 mb-2 text-sm">Platform</p>
                    <ul className="space-y-1 text-sm text-neutral-600">
                        <li><Link href="/explore">Active Missions</Link></li>
                        <li><Link href="/explore">Resource Hub</Link></li>
                        <li><Link href="/register">Volunteer Network</Link></li>
                        <li><Link href="/login">Partner Login</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-neutral-900 mb-2 text-sm">Resources</p>
                    <ul className="space-y-1 text-sm text-neutral-600">
                        <li><Link href="/about">Disaster Manuals</Link></li>
                        <li><Link href="/about">Impact Reports</Link></li>
                        <li><Link href="/about">Press Kit</Link></li>
                        <li><Link href="/about">Success Stories</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-neutral-900 mb-2 text-sm">Support</p>
                    <ul className="space-y-1 text-sm text-neutral-600">
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/contact">Terms of Service</Link></li>
                        <li><Link href="/contact">Privacy Policy</Link></li>
                        <li><Link href="/contact">Ethics Statement</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-neutral-600">
                <p>© 2026 RescueLink Disaster Relief Platform. All rights reserved.</p>
            </div>
        </footer>
    );
}