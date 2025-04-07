import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, Smile, Mic, Send } from "lucide-react"
import { useMobileView } from "@/hooks/use-mobile-view"
import EmojiPicker from "./EmojiPicker"
import SendButton from "./SendButton"

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("")
  const isMobile = useMobileView()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = (e) => {    
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");      
    }
  };

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
            className="w-full p-2 pl-3 rounded-full bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
          />
        </div>

        <Button
          type="button" size="icon" variant="ghost" className="text-gray-500 dark:text-gray-400"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="text-gray-500 dark:text-gray-400 mr-2">
          <Mic className="h-5 w-5" />
        </Button>

        {/* <Button
          type="submit"
          size="icon"
          className={`rounded-full flex items-center justify-center`}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button> */}
        <SendButton message={message} handleSend={handleSend} />

      </form>
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}
    </div>
  )
}

