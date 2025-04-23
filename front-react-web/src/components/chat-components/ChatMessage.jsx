import { useEffect, useRef } from "react"
import { format } from "date-fns"
// Import Avatar components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserAvatar from "./UserAvatart"
import { TbChecks, TbCheck } from "react-icons/tb";
import { useMobileView } from "@/hooks/use-mobile-view";
import { useSelector } from "react-redux";
import { selectConversationMessages } from "@/store/slices/chatSlice";

export default function ChatMessages({ activeConversation }) {

  const conversionMessages = useSelector(selectConversationMessages);
  console.log(conversionMessages);

  const messagesEndRef = useRef(null)
  const isMobile = useMobileView()

  const { user } = useSelector((state) => state.auth)


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversionMessages])

  // Group messages by date
  const groupedMessages = {}

  conversionMessages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })
  Object.keys(groupedMessages).forEach((date) => {
    groupedMessages[date].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });

  const formatMessageTime = (timestamp) => {
    console.log(timestamp);
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

  console.log(conversionMessages);

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 "bg-gray-50 dark:bg-gray-800`}
    >
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {formatDate(date)}
            </span>
          </div>
          {groupedMessages[date].map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.senderId === user._id ? "justify-end" : "justify-start"}`}>
              {message.senderId !== user._id && (
                <div className="mr-2 mt-1">
                  <UserAvatar user={activeConversation?.opponent} />
                </div>
              )}
              <div
                className={`max-w-[75%] ${message.senderId === user._id
                  ? "bg-primary text-primary-foreground dark:bg-gray-700 dark:text-gray-100"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  } rounded-lg p-3 shadow ${message.senderId === user._id ? "rounded-tr-none" : "rounded-tl-none"
                  }`}
              >
                <p>{message.content}</p>

                {/* Time & Ticks shifted to the right */}
                <div
                  className={`text-xs mt-1 flex items-center justify-end ${message.senderId === user._id
                    ? "text-gray-300 dark:text-gray-300"
                    : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                  {formatMessageTime(message.timestamp)}
                  {message.senderId === user._id && (
                    <span className="ml-1">
                      {message.isRead ?
                        <TbChecks className="w-4 h-4 text-blue-500" /> :
                        <TbCheck className="text-gray-500 w-4 h-4" />
                      }
                    </span>
                  )}
                </div>
              </div>

              {message.senderId === user._id && !isMobile && (
                <div className="ml-2 mt-1">
                  {/* <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Me" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar> */}
                  <UserAvatar user={user} />
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



