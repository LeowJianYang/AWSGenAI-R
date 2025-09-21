import SeverityChart from "./SeverityChart"

export default function GraphSection({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    country: d.country,
    severity: typeof d.severity === "object" ? d.severity.value : 0,
  }))

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Severity by Country</h2>
      <SeverityChart data={chartData} />
    </div>
  )
}
