"use client"

import { ShieldCheck, AlertTriangle, Users } from "lucide-react"

export default function EmergencyContact() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <a href="tel:999" className="bg-red-600 text-white p-4 rounded-lg shadow-md hover:brightness-110 transition">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-semibold">Medical Emergency</span>
        </div>
        <p className="text-sm mt-1">Call 999</p>
      </a>
      <a href="tel:994" className="bg-orange-500 text-white p-4 rounded-lg shadow-md hover:brightness-110 transition">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Fire Department</span>
        </div>
        <p className="text-sm mt-1">Call 994</p>
      </a>
      <a href="tel:993" className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:brightness-110 transition">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-semibold">Police</span>
        </div>
        <p className="text-sm mt-1">Call 993</p>
      </a>
    </section>
  )
}
