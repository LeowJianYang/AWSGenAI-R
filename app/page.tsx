"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bell,
  Menu,
  Shield,
  Users,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Minus,
  X,
  MapPin,
  Clock,
  User,
  Building,
  Sun,
  Moon,
  RefreshCcw,
  Search,
  MessageCircle,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic";
import axios from "axios"
import DisasterSearch from '@/components/ui/DisasterSearch'

type DisasterData = {
  title: string,
  pubDate: string,
  eventid: string,
  location: string;
  eventtype: string;
  alertlevel: string;
  level: {
    unit: string;
    value: number;
  };
}

export default function DisasterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [mapZoom, setMapZoom] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [disasterData, setDisasterData] = useState<DisasterData[]>([]);
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [LastUpdated, setLastUpdated] = useState<number>(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant for disaster response. How can I help you today?",
      isAI: true,
      timestamp: "Just now"
    }
  ])
  const sidebarRef = useRef<HTMLDivElement>(null)
  const DisasterMap = dynamic(() => import("@/components/ui/DisasterMap"), {
    ssr: false,
  });

 // Auto-refresh disaster data every 5 minutes
  useEffect (()=>{
    const interval = setInterval(()=>{
       if (Date.now()- LastUpdated > 300000){
        handleRefreshStatus();
        setLastUpdated(Date.now());
       }
    },60000)
    return () => clearInterval(interval);
  }, [LastUpdated])


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('button[aria-label="Open menu"]')) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const liveFeedItems = [
    { icon: User, text: "Bridge collapse reported at Main St.", time: "2m ago", type: "social" },
    { icon: Building, text: "Evacuation complete at Oak Elementary", time: "5m ago", type: "official" },
    { icon: User, text: "Power outage affecting downtown area", time: "8m ago", type: "social" },
    { icon: Building, text: "Emergency shelter opened at Community Center", time: "12m ago", type: "official" },
    { icon: User, text: "Road closure on Highway 101 northbound", time: "15m ago", type: "social" },
  ]

  const mockIncident = {
    id: "1045",
    title: "Building Fire",
    location: "123 Oak Avenue, Riverside",
    timestamp: "45m ago",
    source: "Official Fire Dept. Report",
    description: "A multi-story residential building is on fire. Emergency services are on site.",
  }

  const handleRefreshStatus = async () => {
    axios.get('/api/disaster').then((response) => {
      const mapData = response.data.map((item: any) => ({
        title: item.title,
        pubDate: item.pubDate,
        eventid: item.eventid,
        location: item.country,
        eventType: item.eventtype,
        alertLevel: item.alertlevel,
        level: {
          unit: item.severity["$"].unit,
          value: item.severity["$"].value,
        },
      }));
      console.log("[DEBUG]", mapData);
      setDisasterData(mapData);
      setLastUpdated(Date.now());
    });
  }

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const now = new Date()
      const newMessage = {
        id: messages.length + 1,
        text: chatInput,
        isAI: false,
        timestamp: now.toLocaleTimeString()
      }
      setMessages([...messages, newMessage])
      setChatInput("")
      
      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponseTime = new Date()
        axios.post('/api/ask', { question: newMessage.text }).then((response) => {
          const aiResponse = {
            id: messages.length + 2,
            text: response.data.answer,
            isAI: true,
            timestamp: aiResponseTime.toLocaleTimeString()
          }
          setMessages(prev => [...prev, aiResponse])
        })
      }, 1000)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSidebarOpen(!sidebarOpen); handleRefreshStatus() }}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-lg md:text-2xl font-bold text-card-foreground">Aegis Response</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="h-5 w-5 md:h-6 md:w-6 text-card-foreground" />
              ) : (
                <Moon className="h-5 w-5 md:h-6 md:w-6 text-card-foreground" />
              )}
            </Button>
            <div className="relative">
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-card-foreground" />
              <div className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 bg-primary rounded-full"></div>
            </div>
            <div className="h-6 w-6 md:h-8 md:w-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="flex relative">
          {/* Sidebar - Fixed on the left side, 30% width when open */}
          <aside
            ref={sidebarRef}
            className={`
              fixed inset-y-0 left-0 z-50 h-[calc(100vh-73px)] mt-[73px] transition-all duration-300 ease-in-out
              bg-sidebar text-sidebar-foreground overflow-y-auto border-r border-sidebar-border
              ${sidebarOpen ? 'translate-x-0 w-[30%]' : '-translate-x-full w-0'}
            `}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="flex justify-end flex-row">
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>

                  <Button variant="ghost" size="sm" onClick={() => handleRefreshStatus()}>
                    <RefreshCcw className="h-5 w-5" />
                  </Button>
                </div>

                <DisasterSearch />

                {/* Active Disaster Section */}
                <div className="space-y-3">
                  <h2 className="text-base md:text-lg font-semibold text-sidebar-foreground">Active Disaster</h2>
                  <div className="space-y-2">
                    {disasterData.slice(0, 3).map((item, idx) =>
                      idx < 3 ? (
                        <div key={idx} className="mb-4">
                          <h3 className="text-lg md:text-xl font-bold text-sidebar-foreground">{item.title}</h3>
                          <p className="text-xs md:text-sm text-sidebar-foreground/80">Updated At: {item.pubDate}</p>
                          <p className="text-xs md:text-sm text-sidebar-foreground/80">Severity: {item.level.unit} {item.level.value}</p>
                          <Badge variant="destructive" className="bg-primary text-primary-foreground text-xs">
                            Critical
                          </Badge>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                {/* Map Filters & Layers */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-sidebar-foreground">Map Filters & Layers</h3>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-sidebar-foreground">Disaster Type</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="wildfire">Wildfire</SelectItem>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-sidebar-foreground">Timeframe</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="secondary" size="sm" className="text-xs flex-1">
                        Last Hour
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent flex-1">
                        Last 6H
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent flex-1">
                        Last 24H
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs md:text-sm font-medium text-sidebar-foreground">Data Layers</label>
                    <div className="space-y-2">
                      {[
                        { label: "Incident Reports", checked: true },
                        { label: "Resource Locations", checked: true },
                        { label: "Population Density", checked: false },
                        { label: "Safe Zones / Shelters", checked: true },
                        { label: "Satellite Imagery", checked: false },
                      ].map((layer) => (
                        <div key={layer.label} className="flex items-center space-x-2">
                          <Checkbox id={layer.label} defaultChecked={layer.checked} />
                          <label htmlFor={layer.label} className="text-xs md:text-sm text-sidebar-foreground">
                            {layer.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-sidebar-foreground">Live Feed</h3>
                  <div className="space-y-3">
                    {liveFeedItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 md:p-3 bg-sidebar-accent rounded-lg">
                        <item.icon className="h-4 w-4 text-sidebar-accent-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-sidebar-accent-foreground">{item.text}</p>
                          <p className="text-xs text-sidebar-accent-foreground/70 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - 70% width when sidebar is open, 100% when closed */}
          <div
            className={`
              transition-all duration-300 min-h-[calc(100vh-73px)]
              ${sidebarOpen ? 'w-[70%] ml-[30%]' : 'w-full ml-0'}
            `}
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false)
              }
            }}
          >
            <main className="p-3 md:p-6 space-y-4 md:space-y-6 min-w-0">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium text-card-foreground">
                      Estimated Affected
                    </CardTitle>
                    <Users className="h-4 w-4 text-card-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold text-card-foreground">14,830</div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium text-card-foreground">
                      Active Incidents
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold text-primary">215</div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border sm:col-span-2 lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium text-card-foreground">
                      Resources Deployed
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold text-accent">78</div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Map */}
              <Card className="bg-card border-border">
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg text-card-foreground">Disaster Response Map</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0">
                  <div className="relative">
                    {/* Map Component */}
                    <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
                      <DisasterMap zoom={mapZoom * 10} />
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-1 md:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Affected Areas List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Affected Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { city: "Kuala Lumpur", disaster: "Flood" },
                    { city: "Selangor", disaster: "Wildfire" },
                    { city: "Penang", disaster: "Earthquake" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{d.city}</span>
                      <Badge>{d.disaster}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </main>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>

        {/* Chat Panel - Slides in from right */}
        <div
          className={`
            fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-[9998] 
            transform transition-transform duration-300 ease-in-out
            ${chatOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <h2 className="text-lg font-bold text-card-foreground">Disaster AI Assistant</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex flex-col" style={{ height: 'calc(100% - 73px)' }}>
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isAI
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.timestamp !== "Just now" && (
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about disaster response..."
                  className="flex-1 p-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  size="sm" 
                  className="px-3"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay when chat is open */}
        {chatOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-[9997]"
            onClick={() => setChatOpen(false)}
          />
        )}

        {/* Incident Detail Modal */}
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="bg-popover text-popover-foreground w-[95vw] max-w-md md:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-sm md:text-base">
                <span className="pr-2">
                  Incident #{selectedIncident?.id}: {selectedIncident?.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIncident(null)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            {selectedIncident && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{selectedIncident.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">Reported {selectedIncident.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{selectedIncident.source}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Description</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{selectedIncident.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent text-sm">
                    Acknowledge
                  </Button>
                  <Button variant="default" className="flex-1 bg-primary text-primary-foreground text-sm">
                    Dispatch Unit
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}