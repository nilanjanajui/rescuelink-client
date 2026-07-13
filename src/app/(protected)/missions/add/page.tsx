import JwtSmokeTest from "@/components/missions/JwtSmokeTest";

// TODO (Phase 4): replace this stub with the real Add Mission form
// (title, disaster type, urgency, location, volunteers needed, etc.)
export default function AddMissionPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-neutral-900">Report a Crisis</h1>
            <p className="mt-2 text-neutral-600">
                The full mission form lands in Phase 4. For now, this page exists to prove that
                only signed-in users and admins (not Tenants or logged-out visitors) can reach it,
                and that authenticated requests actually reach Express.
            </p>

            <div className="mt-8">
                <JwtSmokeTest />
            </div>
        </div>
    );
}