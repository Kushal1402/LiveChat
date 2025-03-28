import { useState } from "react"
import ChatSidebar from "@/components/chat-components/ChatSideBar"
import ChatInput from "@/components/chat-components/ChatInput"
import ChatMessages from "@/components/chat-components/ChatMessage"

export default function ChatApplication() {
  // Sample users data
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "Just now",
      unreadCount: 3,
    },
    {
      id: "2",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "5m ago",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "2h ago",
      unreadCount: 0,
    },
    {
      id: "4",
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "1m ago",
      unreadCount: 1,
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "1d ago",
      unreadCount: 0,
    },
  ])

  // Sample messages data
  const [messages, setMessages] = useState([
    {
      id: "1",
      userId: "1",
      text: "Hey there! How are you doing today?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
    },
    {
      id: "2",
      userId: "me",
      text: "I'm doing great, thanks for asking! How about you?",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true,
    },
    {
      id: "3",
      userId: "1",
      text: "Pretty good! Just working on some new designs for the project.",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      isRead: true,
    },
    {
      id: "4",
      userId: "me",
      text: "That sounds interesting! Can you share some of your progress?",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      isRead: true,
    },
    {
      id: "5",
      userId: "1",
      text: "I'll send you some mockups later today.",
      timestamp: new Date(Date.now() - 3200000).toISOString(),
      isRead: true,
    },
    {
      id: "6",
      userId: "1",
      text: "By the way, did you get a chance to review the documents I sent yesterday?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
    },
    {
      id: "7",
      userId: "1",
      text: "We need to finalize them by the end of the week.",
      timestamp: new Date(Date.now() - 1700000).toISOString(),
      isRead: false,
    },
    {
      id: "8",
      userId: "1",
      text: "Let me know if you have any questions!",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      isRead: false,
    },
  ])

  const [selectedUser, setSelectedUser] = useState(users[0])

  const handleSendMessage = (text) => {
    if (!text.trim() || !selectedUser) return

    const newMessage = {
      id: Date.now().toString(),
      userId: "me",
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
    }

    setMessages([...messages, newMessage])
  }

  const handleSelectUser = (user) => {
    // Check if the user already exists in our list
    const existingUserIndex = users.findIndex((u) => u.id === user.id)

    if (existingUserIndex === -1) {
      // This is a new user, add them to our list
      setUsers([...users, user])
    }

    // Mark messages as read when selecting a user
    const updatedMessages = messages.map((message) =>
      message.userId === user.id && !message.isRead ? { ...message, isRead: true } : message,
    )

    setMessages(updatedMessages)

    // Reset unread count for selected user
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, unreadCount: 0 } : u))

    setUsers(updatedUsers)
    setSelectedUser(user)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ChatSidebar users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedUser ? (
          <>
            <div className="flex items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.status === "online" ? "Online" : `Last seen ${selectedUser.lastSeen}`}
                  </p>
                </div>
              </div>
            </div>
            <ChatMessages
              messages={messages.filter((m) => m.userId === selectedUser.id || m.userId === "me")}
              currentUser={selectedUser}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

