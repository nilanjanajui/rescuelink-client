"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ui/ImageUploader";
import { apiFetch, ApiError } from "@/lib/api";
import type { Mission } from "@/types/mission";

const DISASTER_TYPES = [
    { value: "flood", label: "Flood" },
    { value: "earthquake", label: "Earthquake" },
    { value: "fire", label: "Fire" },
    { value: "cyclone", label: "Cyclone" },
    { value: "other", label: "Other" },
];

const URGENCY_LEVELS = [
    { value: "critical", label: "Critical" },
    { value: "moderate", label: "Moderate" },
    { value: "low", label: "Low" },
];

type FormState = {
    title: string;
    shortDescription: string;
    fullDescription: string;
    disasterType: string;
    urgency: string;
    location: string;
    volunteersNeeded: string;
    estimatedHours: string;
    imageUrl: string;
};

const initialState: FormState = {
    title: "",
    shortDescription: "",
    fullDescription: "",
    disasterType: "flood",
    urgency: "moderate",
    location: "",
    volunteersNeeded: "",
    estimatedHours: "4",
    imageUrl: "",
};

export default function AddMissionPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.title || !form.shortDescription || !form.fullDescription || !form.location) {
            setError("Please fill in all required fields.");
            return;
        }
        const volunteersNeeded = Number(form.volunteersNeeded);
        if (!Number.isFinite(volunteersNeeded) || volunteersNeeded < 1) {
            setError("Volunteers needed must be a positive number.");
            return;
        }

        const estimatedHours = Number(form.estimatedHours) || 4;

        setSubmitting(true);
        try {
            const { mission } = await apiFetch<{ mission: Mission }>("/missions", {
                method: "POST",
                body: JSON.stringify({
                    title: form.title,
                    shortDescription: form.shortDescription,
                    fullDescription: form.fullDescription,
                    disasterType: form.disasterType,
                    urgency: form.urgency,
                    location: form.location,
                    volunteersNeeded,
                    estimatedHours,
                    imageUrl: form.imageUrl || undefined,
                }),
            });
            router.push(`/missions/${mission._id}`);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to create mission. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-neutral-900">Report a Crisis</h1>
            <p className="mt-2 text-neutral-600">
                Post a mission so volunteers and coordinators can find and respond to it.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-xl border border-neutral-100 shadow-sm p-6 space-y-5">
                <Input
                    label="Mission Title"
                    placeholder="e.g. Sylhet Flash Flood Response"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    required
                />

                <Input
                    label="Short Description"
                    placeholder="One sentence summary shown on mission cards"
                    value={form.shortDescription}
                    onChange={(e) => update("shortDescription", e.target.value)}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-1">Full Description</label>
                    <textarea
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-30"
                        placeholder="Describe the situation and what help is needed"
                        value={form.fullDescription}
                        onChange={(e) => update("fullDescription", e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">Disaster Type</label>
                        <select
                            className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={form.disasterType}
                            onChange={(e) => update("disasterType", e.target.value)}
                        >
                            {DISASTER_TYPES.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">Urgency</label>
                        <select
                            className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={form.urgency}
                            onChange={(e) => update("urgency", e.target.value)}
                        >
                            {URGENCY_LEVELS.map((u) => (
                                <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <Input
                            label="Location"
                            placeholder="e.g. Sylhet, Sunamganj"
                            value={form.location}
                            onChange={(e) => update("location", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            label="Volunteers Needed"
                            type="number"
                            min="1"
                            placeholder="e.g. 30"
                            value={form.volunteersNeeded}
                            onChange={(e) => update("volunteersNeeded", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            label="Est. Hours / Volunteer"
                            type="number"
                            min="1"
                            placeholder="e.g. 6"
                            value={form.estimatedHours}
                            onChange={(e) => update("estimatedHours", e.target.value)}
                            required
                        />
                    </div>
                </div>

                <ImageUploader
                    value={form.imageUrl}
                    onChange={(url) => update("imageUrl", url)}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Posting..." : "Post Mission"}
                </Button>
            </form>
        </div>
    );
}