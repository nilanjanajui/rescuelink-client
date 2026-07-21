"use client";

import React, { useEffect, useState } from "react";
import type { Mission } from "@/types/mission";

// Leaflet custom icon fix for Next.js SSR
const DefaultMapComponent = ({ missions }: { missions: Mission[] }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-112 w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                Loading Map View...
            </div>
        );
    }

    // Dynamic import inside client component
    const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
    const L = require("leaflet");
    require("leaflet/dist/leaflet.css");

    // Custom marker icon based on urgency level
    const createUrgencyIcon = (urgency: string) => {
        const color = urgency === "critical" ? "#dc2626" : urgency === "moderate" ? "#d97706" : "#2563eb";
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `;
        return L.divIcon({
            html: svg,
            className: "custom-map-pin",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });
    };

    // Bangladesh central coordinates
    const defaultCenter: [number, number] = [23.8103, 90.4125];

    return (
        <div className="h-112 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={7}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {missions.map((mission) => {
                    const lat = mission.coordinates?.lat ?? 23.8103;
                    const lng = mission.coordinates?.lng ?? 90.4125;

                    return (
                        <Marker
                            key={mission._id}
                            position={[lat, lng]}
                            icon={createUrgencyIcon(mission.urgency)}
                        >
                            <Popup className="rounded-xl">
                                <div className="p-1 max-w-xs">
                                    <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2">
                                        <img
                                            src={mission.imageUrl}
                                            alt={mission.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                                        {mission.title}
                                    </h4>
                                    <p className="text-xs text-neutral-500 mt-1">📍 {mission.location}</p>
                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100">
                                        <span className="text-xs font-semibold text-primary">
                                            {mission.volunteersJoined} / {mission.volunteersNeeded} Volunteers
                                        </span>
                                        <a
                                            href={`/missions/${mission._id}`}
                                            className="text-xs bg-primary text-white px-2.5 py-1 rounded-md font-medium hover:bg-primary-dark"
                                        >
                                            View →
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default DefaultMapComponent;
