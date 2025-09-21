type Props = {
  total: number
  average: number
}

export default function SummaryStats({ total, average }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card p-4 rounded shadow text-center">
        <h3 className="text-sm font-semibold text-muted-foreground">Total Events</h3>
        <p className="text-xl font-bold">{total}</p>
      </div>
      <div className="bg-card p-4 rounded shadow text-center">
        <h3 className="text-sm font-semibold text-muted-foreground">Avg Severity</h3>
        <p className="text-xl font-bold">{average.toFixed(2)}</p>
      </div>
    </div>
  )
}
