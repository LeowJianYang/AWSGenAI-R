"use client"

export default function SafetyReminders() {
  return (
    <section className="bg-[var(--muted)] border border-[var(--border)] rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">🔔 Safety Reminders</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--muted-foreground)]">
        <li>Keep emergency kits stocked and accessible.</li>
        <li>Know your local evacuation routes and shelter locations.</li>
        <li>Stay informed via official alerts, radio, or SMS.</li>
      </ul>
    </section>
  )
}
