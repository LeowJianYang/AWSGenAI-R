"use client"

type ProcedureProps = {
  type: string
  steps: string[]
}

export default function ProcedureSteps({ type, steps }: ProcedureProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-[var(--disaster-fire)]">{type} Procedure</h2>
      <ol className="list-decimal pl-4 space-y-1">
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
