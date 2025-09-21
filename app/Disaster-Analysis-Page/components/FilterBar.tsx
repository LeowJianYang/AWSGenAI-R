"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Props = {
  value: string
  onChange: (val: string) => void
}

export default function FilterBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold">Disaster Analysis</h1>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EQ">Earthquake</SelectItem>
          <SelectItem value="TC">Typhoon</SelectItem>
          <SelectItem value="FL">Flood</SelectItem>
          <SelectItem value="VO">Volcano</SelectItem>
          <SelectItem value="SE">Storm Surge</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
