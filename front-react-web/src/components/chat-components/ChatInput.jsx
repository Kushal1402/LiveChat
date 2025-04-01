import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, Smile, Mic, Send } from "lucide-react"
import { useMobileView } from "@/hooks/use-mobile-view"



export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("")
  const isMobile = useMobileView()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex items-center">
        {!isMobile && (
          <Button type="button" size="icon" variant="ghost" className="text-gray-500 dark:text-gray-400">
            <Paperclip className="h-5 w-5" />
          </Button>
        )}
        <div className={`flex-1 ${isMobile ? "" : "mx-2"}`}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 rounded-full bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
          />
        </div>
        {!isMobile && (
          <>
            <Button type="button" size="icon" variant="ghost" className="text-gray-500 dark:text-gray-400">
              <Smile className="h-5 w-5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="text-gray-500 dark:text-gray-400 mr-2">
              <Mic className="h-5 w-5" />
            </Button>
          </>
        )}
        <Button
          type="submit"
          size="icon"
          className={`rounded-full ${isMobile ? "ml-2" : ""}`}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}

