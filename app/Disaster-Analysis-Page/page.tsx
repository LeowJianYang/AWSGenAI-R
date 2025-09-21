"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import FilterBar from "./components/FilterBar"
import GraphSection from "./components/GraphSection"
import SummaryStats from "./components/SummaryStats"
import EventDetailsGrid from "./components/EventDetailsGrid"

export default function DisasterAnalysisPage() {
  const [disType, setDisType] = useState("EQ")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/disaster?disType=${disType}`)
      .then((res) => {
        console.log("[DEBUG] Fetched data:", res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.error("[ERROR] Failed to fetch disaster data:", err)
        setData([])
      })
      .finally(() => setLoading(false))
  }, [disType])

  const totalEvents = data.length

  const avgSeverity = totalEvents
    ? data.reduce((sum, d) => {
        const val = Number(d?.severity?.value) || 0
        return sum + val
      }, 0) / totalEvents
    : 0

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <FilterBar value={disType} onChange={setDisType} />
      <SummaryStats total={totalEvents} average={avgSeverity} />
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading disaster data...</p>
      ) : (
        <>
          <GraphSection data={data.filter(d => d.latitude && d.longitude)} />
          <EventDetailsGrid data={data} />
        </>
      )}
    </main>
  )
}
