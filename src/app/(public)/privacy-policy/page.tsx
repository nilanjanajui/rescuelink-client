export const metadata = { title: "Privacy Policy — RescueLink" };

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-neutral-500 mb-8">Last updated: 2026</p>

            <div className="space-y-6 text-neutral-700 leading-relaxed">
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">What we collect</h2>
                    <p>
                        When you create an account, we collect your name, email address, and (for
                        volunteer accounts) the missions you join. Mission postings include the details
                        an organizer provides — disaster type, location, and volunteer needs.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">How we use it</h2>
                    <p>
                        Your account data is used to authenticate you, show you the missions you&apos;ve
                        joined or posted, and coordinate volunteer activity between organizations and
                        responders. We don&apos;t sell personal data to third parties.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Google Sign-In</h2>
                    <p>
                        If you sign in with Google, we receive your name and email from Google to create
                        your account. Accounts created this way are browse-only by default.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Contact</h2>
                    <p>
                        Questions about this policy can be sent to{" "}
                        <a href="mailto:support@rescuelink.org" className="text-primary hover:underline">
                            support@rescuelink.org
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    );
}