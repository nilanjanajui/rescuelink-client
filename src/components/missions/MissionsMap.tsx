"use client";

import dynamic from "next/dynamic";
import type { Mission } from "@/types/mission";

// The actual map component lives in a separate file so we can lazy-load it
// with ssr: false — Leaflet requires `window` which doesn't exist on the server.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="h-112 w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
            Loading Map View...
        </div>
    ),
});

export default function MissionsMap({ missions }: { missions: Mission[] }) {
    return <LeafletMap missions={missions} />;
}
