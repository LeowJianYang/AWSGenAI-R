"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

type Props = {
  data: {
    title: string
    country: string
    pubDate: string
    lat: number
    long: number
  }[]
}

export default function DisasterMap({ data }: Props) {
  return (
    <MapContainer center={[0, 0]} zoom={2} className="h-[400px] w-full rounded-lg shadow-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {data.map((d, i) => (
        <Marker key={i} position={[d.lat, d.long]}>
          <Popup>
            <strong>{d.title}</strong><br />
            {d.country}<br />
            {new Date(d.pubDate).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
