import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import SignOutButton from "@/components/profile/SignOutButton";
import JoinedMissionsList from "@/components/profile/JoinedMissionsList";

const ROLE_LABELS: Record<string, string> = {
    user: "Volunteer / Coordinator",
    admin: "Administrator",
    Tenant: "Browse-only",
};

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const { user } = session!;
    const isTenant = user.role === "Tenant";

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-8 text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <h1 className="text-xl font-bold text-neutral-900">{user.name}</h1>
                <p className="text-neutral-600 text-sm">{user.email}</p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-red-50 text-primary text-xs font-medium">
                    {ROLE_LABELS[user.role as string] ?? user.role}
                </span>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center gap-3">
                    <Link href="/dashboard" className="text-sm text-primary font-medium hover:underline self-center">
                        Go to Dashboard
                    </Link>
                    <SignOutButton />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">Missions You&apos;ve Joined</h2>
                {isTenant ? (
                    <p className="text-sm text-neutral-600">
                        Browse-only accounts can&apos;t join missions. Register with email to volunteer.
                    </p>
                ) : (
                    <JoinedMissionsList />
                )}
            </div>
        </div>
    );
}