"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";

/**
 * Temporary Phase 2 smoke test: proves the client → Express JWT chain
 * actually works (verifyJWT + requireRole) before real mission creation
 * exists in Phase 4. Safe to delete once the real form replaces it.
 */
export default function JwtSmokeTest() {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const runTest = async () => {
        setLoading(true);
        setResult(null);
        try {
            const data = await apiFetch<{ message: string; user: { role: string } }>("/missions", {
                method: "POST",
                body: JSON.stringify({}),
            });
            setResult(`✓ ${data.message} (role: ${data.user.role})`);
        } catch (err) {
            const message = err instanceof ApiError ? `${err.status}: ${err.message}` : "Something went wrong";
            setResult(`✗ ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-dashed border-neutral-300 p-6">
            <p className="text-sm text-neutral-600 mb-3">
                Phase 2 check — confirms your JWT reaches Express and passes role verification.
            </p>
            <Button variant="outline" onClick={runTest} disabled={loading}>
                {loading ? "Checking..." : "Test authenticated request"}
            </Button>
            {result && <p className="mt-3 text-sm font-mono">{result}</p>}
        </div>
    );
}