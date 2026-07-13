import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Gates every route under (protected): anyone without a session goes to
 * /login, and Tenants (Google sign-ins, browse-only) get bounced back to
 * the home page since they can't post or manage missions.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/login");
    }

    if (session.user.role === "Tenant") {
        redirect("/");
    }

    return <>{children}</>;
}