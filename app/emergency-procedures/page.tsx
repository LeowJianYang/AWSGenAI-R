import EmergencyContact from "./components/EmergencyContactCards"
import DisasterType from "./components/DisasterTypeGrid"
import QuickActions from "./components/QuickActions"
import SafetyReminders from "./components/SafetyReminders"
import FooterCTA from "./components/FooterCTA"
import { useState } from "react"


export default function EmergencyPrepPage() {
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const procedures = [
    {
      type: "Flood",
      color: "var(--disaster-flood)",
      steps: [
        "Move to higher ground immediately.",
        "Avoid walking or driving through floodwaters.",
        "Turn off electricity and gas if safe to do so.",
      ],
    },
    {
      type: "Wildfire",
      color: "var(--disaster-fire)",
      steps: [
        "Evacuate early if instructed.",
        "Close all windows and doors to prevent smoke.",
        "Wear a mask to reduce smoke inhalation.",
      ],
    },
    {
      type: "Earthquake",
      color: "var(--disaster-earthquake)",
      steps: [
        "Drop, Cover, and Hold On.",
        "Stay indoors until the shaking stops.",
        "Check for injuries and hazards before exiting.",
      ],
    },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <EmergencyContact />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {procedures.map((p, i) => (
          <DisasterType key={i} type={p.type} color={p.color} steps={p.steps} />
        ))}
      </section>
      <QuickActions />
      <SafetyReminders />
      <FooterCTA />
    </main>
)
}
