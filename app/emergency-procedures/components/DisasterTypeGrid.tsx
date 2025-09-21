"use client"

type Props = {
  type: string
  color: string
  steps: string[]
}

export default function DisasterType({ type, color, steps }: Props) {
  return (
    <div className="rounded-lg shadow-md p-4 text-white" style={{ backgroundColor: color }}>
      <h3 className="text-lg font-bold mb-2">{type} Procedure</h3>
      <ol className="list-decimal pl-4 space-y-1 text-sm">
        {steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
