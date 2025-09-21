"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  data: { country: string; severity: number }[]
}

export default function SeverityChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.country || "Unknown"),
    datasets: [
      {
        label: "Severity",
        data: data.map((d) => d.severity),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Disaster Severity by Country" },
    },
  }

  return <Bar data={chartData} options={chartOptions} />
}
