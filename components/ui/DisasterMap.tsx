"use client";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { DisasterData } from "@/app/disaster";

function hasCoords(d: DisasterData): d is DisasterData & { lat: number; lon: number } {
  return typeof d.lat === "number" && typeof d.lon === "number";
}

type DisasterMapProps = {
  zoom?: number;
  data: DisasterData[];
  focus?: { lat: number; lon: number } | null;
};

export default function DisasterMap({ zoom = 2, data, focus }: DisasterMapProps) {
  // Custom component to update map view
  function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom, { animate: true });
    }, [center[0], center[1], zoom]);
    return null;
  }
  // Debug log for incoming data and focus
  console.log('[DisasterMap] data:', data);
  console.log('[DisasterMap] focus:', focus);
  // Use same normalization as page.tsx
  function normalizeSeverity(val: string | undefined): string {
    if (!val) return "unknown";
    const v = val.toString().trim().toLowerCase();
    if (["critical", "red"].includes(v)) return "critical";
    if (["high"].includes(v)) return "high";
    if (["moderate", "medium", "orange", "orangered", "yellow"].includes(v)) return "moderate";
    if (["low", "green"].includes(v)) return "low";
    return "unknown";
  }
  const severityColors: Record<string, string> = {
    critical: "#ef4444", // red-500
    high: "#3b82f6", // blue-500
    moderate: "#f97316", // orange-500
    low: "#22c55e", // green-500
    unknown: "#a3a3a3", // gray-400
  };

  return (
    <MapContainer
      center={focus ? [focus.lat, focus.lon] : [20, 0]}
      zoom={focus ? Math.max(zoom, 6) : zoom}
      className="h-full w-full rounded-lg"
    >
      {/* Imperatively update map view when focus/zoom changes */}
      {focus && <MapUpdater center={[focus.lat, focus.lon]} zoom={Math.max(zoom, 6)} />}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {data.filter(hasCoords).map((d, i) => {
        const level = normalizeSeverity(d.alertlevel);
        const color = severityColors[level];
        // Use a small, suitable circle size
        const baseRadius = d.level?.value ? Math.max(d.level.value * 500, 20000) : 20000; // Minimum 20km, scale with severity
        return (
          <Circle
            key={i}
            center={[d.lat as number, d.lon as number]}
            radius={baseRadius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.7, weight: 3 }}
          >
            <Popup>
              <h3 className="font-bold">{d.location}</h3>
              <p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: color,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {d.eventtype}
                </span>
              </p>
              <p>Severity: {d.level ? `${d.level.unit} ${d.level.value}` : "N/A"}</p>
              <p>Alert: {d.alertlevel}</p>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
}
