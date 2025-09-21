"use client";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type DisasterMapProps = {
  zoom?: number; // optional, default will be 10
};

export default function DisasterMap({ zoom = 10 }: DisasterMapProps) {
    // inside DisasterMap.tsx, above the return
    const mockDisasters = [
    {
        id: 1,
        type: "Flood",
        city: "Kuala Lumpur",
        coords: [3.139, 101.6869],
        radius: 5000, // in meters
        severity: "High",
    },
    {
        id: 2,
        type: "Wildfire",
        city: "Selangor",
        coords: [3.0738, 101.5183],
        radius: 8000,
        severity: "Critical",
    },
    {
        id: 3,
        type: "Earthquake",
        city: "Penang",
        coords: [5.4141, 100.3288],
        radius: 7000,
        severity: "Moderate",
    },
    ];

  return (
    <MapContainer
      center={[3.139, 101.6869]} // KL coords
      zoom={zoom}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {mockDisasters.map((disaster) => (
        <Circle
            key={disaster.id}
            center={disaster.coords as [number, number]}
            radius={disaster.radius}
            pathOptions={{
            color:
                disaster.type === "Flood"
                ? "blue"
                : disaster.type === "Wildfire"
                ? "red"
                : "orange",
            fillOpacity: 0.3,
            }}
        >
            <Popup>
            <strong>{disaster.type}</strong> in {disaster.city} <br />
            Severity: {disaster.severity}
            </Popup>
        </Circle>
        ))}
    </MapContainer>
  );
}
