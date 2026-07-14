"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/types/mission";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`)
            .then((res) => res.json())
            .then((data) => setTestimonials(data.testimonials ?? []))
            .catch(() => { });
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section className="bg-neutral-50 px-4 md:px-8 py-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-2">
                    Voices from the Field
                </h2>
                <p className="text-neutral-600 text-center mb-10">
                    Real feedback from the volunteers and organizations using RescueLink.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t) => (
                        <div key={t._id} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                            <p className="text-neutral-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    <Image src={t.avatarUrl} alt={t.authorName} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-neutral-900">{t.authorName}</p>
                                    <p className="text-xs text-neutral-600">{t.authorRole}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}