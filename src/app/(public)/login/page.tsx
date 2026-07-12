"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

// Demo credentials get seeded through Better Auth's API (see the seed script),
// then exposed here so the demo buttons can sign straight in without typing.
const DEMO_USER = {
    email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "demo.user@rescuelink.org",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "",
};
const DEMO_ADMIN = {
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "demo.admin@rescuelink.org",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loadingKey, setLoadingKey] = useState<"form" | "google" | "demoUser" | "demoAdmin" | null>(null);

    const signInWith = async (creds: { email: string; password: string }, key: typeof loadingKey) => {
        setError(null);
        setLoadingKey(key);

        await authClient.signIn.email(
            { email: creds.email, password: creds.password },
            {
                onSuccess: () => router.push("/"),
                onError: (ctx) => setError(ctx.error.message ?? "Couldn't sign you in. Check your credentials."),
            }
        );

        setLoadingKey(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signInWith({ email, password }, "form");
    };

    const handleGoogle = async () => {
        setError(null);
        setLoadingKey("google");
        await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    };

    return (
        <AuthShell
            mode="login"
            headline={
                <>
                    Connecting Volunteers.
                    <br />
                    Saving Lives.
                </>
            }
            subtext="The centralized platform for disaster relief coordination, resource management, and frontline communication."
        >
            <h2 className="text-2xl font-bold text-neutral-900">Welcome Back</h2>
            <p className="mt-1 text-neutral-600">Access your relief coordinator dashboard</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="coordinator@rescue.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-neutral-900">Password</label>
                        <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loadingKey === "form"}>
                    {loadingKey === "form" ? "Logging in..." : "Login"}
                </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-300" />
                <span className="text-xs text-neutral-600">OR CONTINUE WITH</span>
                <div className="h-px flex-1 bg-neutral-300" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
                <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loadingKey === "google"}>
                    Continue with Google
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => signInWith(DEMO_USER, "demoUser")}
                        disabled={loadingKey === "demoUser"}
                    >
                        Demo Login (User)
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => signInWith(DEMO_ADMIN, "demoAdmin")}
                        disabled={loadingKey === "demoAdmin"}
                    >
                        Demo Login (Admin)
                    </Button>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                    Create Account
                </Link>
            </p>
        </AuthShell>
    );
}