"use client"

type Disaster = {
  title: string
  pubDate: string
  eventtype: string
  alertlevel: string
  country: string
  severity: { value: number; unit: string } | string
  cap: string
  eventid: string
  enclosure?: string
  lat?: number
  long?: number
}

export default function EventDetailsGrid({ data }: { data: Disaster[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((d, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          {/* Optional Image */}
          {d.enclosure && (
            <img
              src={d.enclosure}
              alt="Disaster image"
              className="w-full h-32 object-cover rounded mb-3"
            />
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold mb-2">{d.title}</h3>

          {/* Metadata */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>📍 <strong>Country:</strong> {d.country || "Unknown"}</p>
            <p>📅 <strong>Date:</strong> {new Date(d.pubDate).toLocaleString()}</p>
            <p>⚠️ <strong>Alert Level:</strong> {d.alertlevel}</p>
            <p>📊 <strong>Severity:</strong> {typeof d.severity === "object" ? `${d.severity.value} ${d.severity.unit}` : "N/A"}</p>
            {d.lat !== undefined && d.long !== undefined && (
              <>
                <p>🧭 <strong>Coordinates:</strong> {d.lat.toFixed(2)}, {d.long.toFixed(2)}</p>
                <a
                  href={`https://www.google.com/maps?q=${d.lat},${d.long}`}
                  target="_blank"
                  className="text-accent underline text-xs"
                >
                  View on Map
                </a>
              </>
            )}
          </div>

          {/* CTA */}
          <a
            href={`https://www.gdacs.org/report.aspx?eventtype=${d.eventtype}&eventid=${d.eventid}`}
            target="_blank"
            className="text-accent underline text-xs mt-3 block"
          >
            View Full Report
          </a>
        </div>
      ))}
    </div>
  )
}
