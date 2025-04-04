import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  Coffee, 
  Briefcase, 
  Moon, 
  Gamepad2,
  Check
} from "lucide-react"
import { useState } from "react"

const statusOptions = [
  {
    value: "available",
    label: "Available",
    icon: CheckCircle2,
    color: "text-green-500"
  },
  {
    value: "busy",
    label: "Busy",
    icon: Clock,
    color: "text-yellow-500"
  },
  {
    value: "at_work",
    label: "At Work",
    icon: Briefcase,
    color: "text-blue-500"
  },
  {
    value: "break",
    label: "On a Break",
    icon: Coffee,
    color: "text-orange-500"
  },
  {
    value: "away",
    label: "Away",
    icon: Moon,
    color: "text-purple-500"
  },
  {
    value: "gaming",
    label: "Gaming",
    icon: Gamepad2,
    color: "text-red-500"
  }
]

const StatusSelector = () => {
  const [selectedStatus, setSelectedStatus] = useState("available")
  const [isSaving, setIsSaving] = useState(false)

  const handleStatusChange = async (status) => {
    setIsSaving(true)
    try {
      // Add your status update logic here
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedStatus(status)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Current Status</span>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-4">
        {statusOptions.map((status) => {
          const Icon = status.icon
          const isSelected = selectedStatus === status.value
          
          return (
            <Button
              key={status.value}
              variant={isSelected ? "secondary" : "outline"}
              className={`h-24 flex-col gap-2 text-sm ${status.color} hover:${status.color}`}
              onClick={() => handleStatusChange(status.value)}
              disabled={isSaving}
            >
              <Icon className={`h-6 w-6 ${status.color}`} />
              <span>{status.label}</span>
              {isSelected && <Check className="h-4 w-4" />}
            </Button>
          )
        })}
      </CardContent>

      {/* Status Preview */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Your status will appear as:</span>
          {statusOptions
            .find(status => status.value === selectedStatus)
            ?.icon({ className: "h-4 w-4" })}
          <span>
            {statusOptions.find(status => status.value === selectedStatus)?.label}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default StatusSelector