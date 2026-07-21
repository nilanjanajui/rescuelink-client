"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageContext";

export interface BadgeItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

interface ImpactBadgesProps {
    badges: BadgeItem[];
}

export default function ImpactBadges({ badges }: ImpactBadgesProps) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-4 flex items-center gap-2">
                <span>{t("profile.badges_title")}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                            badge.unlocked
                                ? "bg-amber-50/40 border-amber-200 shadow-xs"
                                : "bg-neutral-50 border-neutral-200 opacity-60 grayscale"
                        }`}
                    >
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                                badge.unlocked ? "bg-amber-100" : "bg-neutral-200"
                            }`}
                        >
                            {badge.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm text-neutral-900 truncate">{badge.name}</h3>
                                {badge.unlocked && (
                                    <span className="text-[10px] uppercase tracking-wide bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-xs">
                                        Unlocked
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{badge.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
