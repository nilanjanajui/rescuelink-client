export const metadata = { title: "Terms of Service — RescueLink" };

export default function TermsOfServicePage() {
    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Terms of Service</h1>
            <p className="text-sm text-neutral-500 mb-8">Last updated: 2026</p>

            <div className="space-y-6 text-neutral-700 leading-relaxed">
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Using RescueLink</h2>
                    <p>
                        RescueLink is a coordination platform connecting volunteers with disaster relief
                        missions posted by verified users and organizations. By creating an account, you
                        agree to provide accurate information and use the platform in good faith.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Posting missions</h2>
                    <p>
                        Users who post missions are responsible for the accuracy of the information they
                        share, including urgency level, location, and volunteer requirements. Misleading
                        or fraudulent postings may result in account suspension.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Volunteering</h2>
                    <p>
                        Joining a mission indicates intent to participate, coordinated directly with the
                        posting organization. RescueLink facilitates discovery and coordination; it is not
                        itself a party to any relief work performed.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Account roles</h2>
                    <p>
                        Accounts created via email/password can post and join missions. Accounts created
                        via Google Sign-In are browse-only. Administrators may moderate content and manage
                        accounts as needed to keep the platform trustworthy.
                    </p>
                </section>
                <section>
                    <h2 className="font-semibold text-neutral-900 mb-2">Contact</h2>
                    <p>
                        Questions about these terms can be sent to{" "}
                        <a href="mailto:support@rescuelink.org" className="text-primary hover:underline">
                            support@rescuelink.org
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    );
}