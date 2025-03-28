import { useEffect, useRef } from "react"
import { format } from "date-fns"
// Import Avatar components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserAvatar from "./UserAvatart"


export default function ChatMessages({ messages, currentUser }) {
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Group messages by date
  const groupedMessages = {}

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a")
  }

  const isToday = (date) => {
    return new Date(date).toDateString() === new Date().toDateString()
  }

  const isYesterday = (date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return new Date(date).toDateString() === yesterday.toDateString()
  }

  const formatDate = (date) => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return date
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-850">
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {formatDate(date)}
            </span>
          </div>
          {groupedMessages[date].map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.userId === "me" ? "justify-end" : "justify-start"}`}>
              {message.userId !== "me" && (
                <div className="mr-2 mt-1">
                  <UserAvatar user={currentUser} />
                </div>
              )}
              <div
                className={`max-w-[70%] ${
                  message.userId === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                } rounded-lg p-3 shadow`}
              >
                <p>{message.text}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.userId === "me" ? "text-primary-foreground/80" : "text-gray-500 dark:text-gray-400"
                  } flex items-center`}
                >
                  {formatMessageTime(message.timestamp)}
                  {message.userId === "me" && <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>}
                </div>
              </div>
              {message.userId === "me" && (
                <div className="ml-2 mt-1">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Me" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}



