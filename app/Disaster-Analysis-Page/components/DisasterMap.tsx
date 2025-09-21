"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

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
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (map) {
      setTimeout(() => {
        map.invalidateSize()
      }, 300)
    }
  }, [])

  return (
    <div className="h-[400px] w-full rounded-lg shadow-md overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full"
        ref={mapRef}
      >
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
    </div>
  )
}
