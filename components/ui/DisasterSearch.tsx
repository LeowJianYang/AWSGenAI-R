'use client'

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  MapPin,
  Flame,
  Droplets,
  Wind,
  AlertTriangle
} from 'lucide-react'

interface DisasterItem {
  id: string | number
  type: string
  location: string
  severity: string
  description: string
  updated: string
  status: string
}

// Icon component
const DisasterIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'wildfire':
      return <Flame className="h-4 w-4 text-orange-500" />
    case 'flood':
      return <Droplets className="h-4 w-4 text-blue-500" />
    case 'hurricane':
    case 'tornado':
      return <Wind className="h-4 w-4 text-gray-500" />
    case 'earthquake':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    default:
      return <AlertTriangle className="h-4 w-4 text-red-500" />
  }
}

// Severity badge component
const SeverityBadge = ({ severity }: { severity: string }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(severity)}`}>
      {severity}
    </span>
  )
}

export default function DisasterSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [disasters, setDisasters] = useState<DisasterItem[]>([])

  useEffect(() => {
    fetch('/api/disaster')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any, idx: number) => ({
        id: item.eventid || idx,
       type: mapEventType(item.eventtype),
       location: item.country || "Unknown",
       severity: typeof item.severity === 'object' ? item.severity._ || "N/A" : item.severity || "N/A",
       description: item.title,
       updated: item.pubDate,
       status: item.alertlevel || "Unknown",
}))

        setDisasters(mapped)
      })
  }, [])

  function mapEventType(code: string) {
    switch (code) {
      case 'EQ': return 'earthquake'
      case 'TC': return 'hurricane'
      case 'FL': return 'flood'
      case 'VO': return 'volcano'
      default: return code?.toLowerCase() || 'other'
    }
  }

  const filteredDisasters = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase().trim()
    return disasters.filter(
      disaster =>
        disaster.location.toLowerCase().includes(query) ||
        disaster.type.toLowerCase().includes(query)
    )
  }, [searchQuery, disasters])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by city or state (e.g., 'CA', 'Los Angeles')"
          className="w-full bg-background pl-8 p-2 rounded-md border border-border"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
        />
      </div>

      {/* Search Results */}
      {isSearchFocused && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-border shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredDisasters.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground mb-2 px-2">
                {filteredDisasters.length} disaster{filteredDisasters.length !== 1 ? 's' : ''} found
              </p>
              {filteredDisasters.map(disaster => (
                <div key={disaster.id} className="p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <DisasterIcon type={disaster.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{disaster.type}</h4>
                        <SeverityBadge severity={disaster.severity} />
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{disaster.location}</span>
                      </div>
                      <p className="text-xs mb-1">{disaster.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{disaster.updated}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          disaster.status === 'Active' ? 'bg-red-100 text-red-800' :
                          disaster.status === 'Imminent' ? 'bg-orange-100 text-orange-800' :
                          disaster.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {disaster.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No disasters found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching with a different location</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
