"use client";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import MissionCard from "@/components/missions/MissionCard";
import MissionsMap from "@/components/missions/MissionsMap";
import { useLanguage } from "@/components/providers/LanguageContext";
import type { Mission, Pagination } from "@/types/mission";

const DISASTER_OPTIONS = [
    { value: "", label: "All" },
    { value: "flood", label: "Flood" },
    { value: "earthquake", label: "Earthquake" },
    { value: "fire", label: "Fire" },
    { value: "cyclone", label: "Cyclone" },
    { value: "other", label: "Other" },
];

const URGENCY_OPTIONS = [
    { value: "", label: "All" },
    { value: "critical", label: "Critical" },
    { value: "moderate", label: "Moderate" },
    { value: "low", label: "Low" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "resolved", label: "Resolved" },
];

const SORT_OPTIONS = [
    { value: "urgent", label: "Most Urgent" },
    { value: "recent", label: "Most Recent" },
    { value: "volunteers", label: "Most Volunteers Needed" },
];

const PAGE_SIZE = 8;

function FilterSelect({
    value,
    onChange,
    options,
    ariaLabel,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    ariaLabel: string;
}) {
    return (
        <select
            aria-label={ariaLabel}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {ariaLabel}: {opt.label}
                </option>
            ))}
        </select>
    );
}

export default function ExplorePage() {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [disasterType, setDisasterType] = useState("");
    const [urgency, setUrgency] = useState("");
    const [status, setStatus] = useState("active");
    const [sort, setSort] = useState("urgent");
    const [page, setPage] = useState(1);

    const [missions, setMissions] = useState<Mission[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);

    const handleSearchChange = (value: string) => setSearch(value);
    const handleDisasterChange = (value: string) => { setDisasterType(value); setPage(1); setLoading(true); };
    const handleUrgencyChange = (value: string) => { setUrgency(value); setPage(1); setLoading(true); };
    const handleStatusChange = (value: string) => { setStatus(value); setPage(1); setLoading(true); };
    const handleSortChange = (value: string) => { setSort(value); setPage(1); setLoading(true); };

    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== debouncedSearch) {
                setDebouncedSearch(search);
                setPage(1);
                setLoading(true);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [search, debouncedSearch]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (disasterType) params.set("disasterType", disasterType);
        if (urgency) params.set("urgency", urgency);
        if (status) params.set("status", status);
        params.set("sort", sort);
        params.set("page", String(page));
        params.set("pageSize", String(PAGE_SIZE));
        return params.toString();
    }, [debouncedSearch, disasterType, urgency, status, sort, page]);

    useEffect(() => {
        let cancelled = false;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions?${queryString}`)
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                setMissions(data.missions ?? []);
                setPagination(data.pagination ?? null);
            })
            .catch(() => {
                if (!cancelled) {
                    setMissions([]);
                    setPagination(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [queryString]);

    const pageNumbers = useMemo(() => {
        if (!pagination) return [];
        const { page: current, totalPages } = pagination;
        const nums = new Set<number>([1, totalPages, current, current - 1, current + 1]);
        return [...nums].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    }, [pagination]);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{t("missions.title")}</h1>
                <p className="text-neutral-600 mt-2">Search and filter active missions to find where your skills are needed most.</p>
            </div>

            {/* View Mode Toggle & Search */}
            <div className="max-w-2xl mx-auto mb-6 flex items-center gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Search by location, disaster type, or keyword"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            viewMode === "grid" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                        }`}
                    >
                        <span>📱</span> {t("missions.view_grid")}
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            viewMode === "map" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                        }`}
                    >
                        <span>🗺️</span> {t("missions.view_map")}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
                <FilterSelect ariaLabel="Disaster" value={disasterType} onChange={handleDisasterChange} options={DISASTER_OPTIONS} />
                <FilterSelect ariaLabel="Urgency" value={urgency} onChange={handleUrgencyChange} options={URGENCY_OPTIONS} />
                <FilterSelect ariaLabel="Status" value={status} onChange={handleStatusChange} options={STATUS_OPTIONS} />
                <div className="w-px bg-neutral-300 my-1" />
                <FilterSelect ariaLabel="Sort" value={sort} onChange={handleSortChange} options={SORT_OPTIONS} />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <Skeleton key={i} className="h-72" />
                    ))}
                </div>
            ) : missions.length === 0 ? (
                <p className="text-center text-neutral-600 py-16">No missions match your filters right now.</p>
            ) : viewMode === "map" ? (
                <div className="mb-12">
                    <MissionsMap missions={missions} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {missions.map((mission) => (
                        <MissionCard key={mission._id} mission={mission} />
                    ))}
                </div>
            )}

            {viewMode === "grid" && pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                        onClick={() => { setLoading(true); setPage((p) => Math.max(1, p - 1)); }}
                        disabled={pagination.page === 1}
                        className="w-9 h-9 rounded-full border border-neutral-300 disabled:opacity-40 flex items-center justify-center"
                        aria-label="Previous page"
                    >
                        ‹
                    </button>

                    {pageNumbers.map((num, i) => (
                        <span key={num} className="flex items-center">
                            {i > 0 && pageNumbers[i - 1] !== num - 1 && <span className="px-1 text-neutral-400">…</span>}
                            <button
                                onClick={() => { setLoading(true); setPage(num); }}
                                className={`w-9 h-9 rounded-full font-medium ${num === pagination.page ? "bg-primary text-white" : "border border-neutral-300 text-neutral-700"
                                    }`}
                            >
                                {num}
                            </button>
                        </span>
                    ))}

                    <button
                        onClick={() => { setLoading(true); setPage((p) => Math.min(pagination.totalPages, p + 1)); }}
                        disabled={pagination.page === pagination.totalPages}
                        className="w-9 h-9 rounded-full border border-neutral-300 disabled:opacity-40 flex items-center justify-center"
                        aria-label="Next page"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}