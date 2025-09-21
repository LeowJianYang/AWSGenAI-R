"use client"

export default function QuickActions() {
  return (
    <section className="flex flex-col sm:flex-row gap-4">
      <button className="flex-1 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition">
        📥 Download Emergency Guide
      </button>
      <button className="flex-1 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition">
        🗺️ Open Emergency Map
      </button>
    </section>
  )
}
