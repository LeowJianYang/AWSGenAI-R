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

  useEffect(() => {
    axios.get(`/api/disaster?disType=${disType}`).then((res) => {
      setData(res.data)
    })
  }, [disType])

  const totalEvents = data.length
  const avgSeverity =
    data.reduce((sum, d) => {
      const val = typeof d.severity === "object" ? d.severity.value : 0
      return sum + val
    }, 0) / (data.length || 1)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <FilterBar value={disType} onChange={setDisType} />
      <SummaryStats total={totalEvents} average={avgSeverity} />
      <GraphSection data={data} />
      <EventDetailsGrid data={data} />
    </main>
  )
}
