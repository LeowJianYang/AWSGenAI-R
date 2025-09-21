"use client"

import Link from "next/link"

export default function FooterCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="/emergency-prep">
        <button className="bg-[var(--critical)] text-[var(--critical-foreground)] px-4 py-2 rounded-md font-semibold shadow-lg animate-pulse hover:brightness-110 transition">
          🚨 Emergency Procedures
        </button>
      </Link>
    </div>
  )
}
