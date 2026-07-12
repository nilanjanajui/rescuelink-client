"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

const DEMO_USER = {
    email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "demo.user@rescuelink.org",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "",
};

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loadingKey, setLoadingKey] = useState<"form" | "google" | "demo" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoadingKey("form");

        await authClient.signUp.email(
            { name, email, password },
            {
                onSuccess: () => router.push("/"),
                onError: (ctx) => setError(ctx.error.message ?? "Couldn't create your account."),
            }
        );

        setLoadingKey(null);
    };

    const handleGoogle = async () => {
        setError(null);
        setLoadingKey("google");
        await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    };

    const handleDemo = async () => {
        setError(null);
        setLoadingKey("demo");
        await authClient.signIn.email(
            { email: DEMO_USER.email, password: DEMO_USER.password },
            {
                onSuccess: () => router.push("/"),
                onError: (ctx) => setError(ctx.error.message ?? "Demo access is unavailable right now."),
            }
        );
        setLoadingKey(null);
    };

    return (
        <AuthShell
            mode="register"
            headline={
                <>
                    Join the Frontline.
                    <br />
                    Save Lives.
                </>
            }
            subtext="Connecting volunteers, saving lives. Join our unified coordination platform to streamline disaster response and recovery efforts."
        >
            <h2 className="text-2xl font-bold text-neutral-900">Create Your Account</h2>
            <p className="mt-1 text-neutral-600">Join our global network of responders and coordinators.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@rescuelink.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loadingKey === "form"}>
                    {loadingKey === "form" ? "Creating account..." : "Create Account"}
                </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-300" />
                <span className="text-xs text-neutral-600">OR CONTINUE WITH</span>
                <div className="h-px flex-1 bg-neutral-300" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loadingKey === "google"}>
                    Google
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDemo} disabled={loadingKey === "demo"}>
                    Demo Access
                </Button>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-600">
                Already have an account?{" "}
                <Link href="/login" className="text-accent font-medium hover:underline">
                    Log In
                </Link>
            </p>
        </AuthShell>
    );
}