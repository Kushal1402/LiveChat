import { useState } from "react"
import ChatSidebar from "@/components/chat-components/ChatSideBar"
import ChatInput from "@/components/chat-components/ChatInput"
import ChatMessages from "@/components/chat-components/ChatMessage"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import UserAvatar from "@/components/chat-components/UserAvatart"
import { ArrowLeft, Menu } from "lucide-react"
import { MobileDrawer } from "@/components/chat-components/MobileDrawer"
import { useMobileView } from "@/hooks/use-mobile-view"
import { Button } from "@/components/ui/button"

export default function ChatApplication() {
  const isMobile = useMobileView()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showChat, setShowChat] = useState(false)
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
    // New users below
    {
      id: "6",
      name: "Emily Clark",
      email: "emily.clark@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "30s ago",
      unreadCount: 2,
    },
    {
      id: "7",
      name: "Daniel Lee",
      email: "daniel.lee@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "3h ago",
      unreadCount: 0,
    },
    {
      id: "8",
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "10m ago",
      unreadCount: 5,
    },
    {
      id: "9",
      name: "James Taylor",
      email: "james.taylor@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "1w ago",
      unreadCount: 0,
    },
    {
      id: "10",
      name: "Sophia Anderson",
      email: "sophia.anderson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "Just now",
      unreadCount: 0,
    },
  ]);

  const [messages, setMessages] = useState([
    // Your existing messages (1-8)
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

    // New messages below (9-23)
    {
      id: "9",
      userId: "me",
      text: "I’ll review them tonight and send you feedback first thing tomorrow.",
      timestamp: new Date(Date.now() - 800000).toISOString(),
      isRead: true,
    },
    {
      id: "10",
      userId: "4",
      text: "Hey team! Quick reminder about our meeting at 2 PM today.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
    },
    {
      id: "11",
      userId: "me",
      text: "Thanks for the reminder, Sarah! I’ll be there.",
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      isRead: true,
    },
    {
      id: "12",
      userId: "2",
      text: "Can someone share the meeting link again?",
      timestamp: new Date(Date.now() - 7000000).toISOString(),
      isRead: true,
    },
    {
      id: "13",
      userId: "4",
      text: "Here you go: meet.example.com/team-standup",
      timestamp: new Date(Date.now() - 6900000).toISOString(),
      isRead: true,
    },
    {
      id: "14",
      userId: "6",
      text: "Has anyone checked the latest API changes? They might affect our frontend.",
      timestamp: new Date(Date.now() - 5000000).toISOString(),
      isRead: false,
    },
    {
      id: "15",
      userId: "me",
      text: "I’ll take a look right now. Emily, can you tag me in the PR?",
      timestamp: new Date(Date.now() - 4900000).toISOString(),
      isRead: true,
    },
    {
      id: "16",
      userId: "6",
      text: "Done! Here’s the link: github.com/ourproject/pull/42",
      timestamp: new Date(Date.now() - 4800000).toISOString(),
      isRead: true,
    },
    {
      id: "17",
      userId: "3",
      text: "I’m OOO tomorrow. Jane will cover my tasks.",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isRead: true,
    },
    {
      id: "18",
      userId: "1",
      text: "Got it. Michael, enjoy your time off!",
      timestamp: new Date(Date.now() - 86300000).toISOString(),
      isRead: true,
    },
    {
      id: "19",
      userId: "5",
      text: "The server will undergo maintenance tonight at 2 AM.",
      timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      isRead: false,
    },
    {
      id: "20",
      userId: "me",
      text: "How long will the downtime be?",
      timestamp: new Date(Date.now() - 43000000).toISOString(),
      isRead: true,
    },
    {
      id: "21",
      userId: "5",
      text: "Approx. 30 minutes. I’ll send updates if anything changes.",
      timestamp: new Date(Date.now() - 42500000).toISOString(),
      isRead: false,
    },
    {
      id: "22",
      userId: "8",
      text: "Happy Friday everyone! 🎉",
      timestamp: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
      isRead: true,
    },
    {
      id: "23",
      userId: "me",
      text: "Same to you, Olivia! Any weekend plans?",
      timestamp: new Date(Date.now() - 28000000).toISOString(),
      isRead: false,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState('')

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

    // For mobile: close drawer and show chat
    if (isMobile) {
      setDrawerOpen(false)
      setShowChat(true)
    }
  }

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowChat(false)
  }

  // Render sidebar content (used in both desktop and mobile)
  const sidebarContent = <ChatSidebar users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />



  // Render chat content (used in both desktop and mobile)
  const chatContent = selectedUser ? (
    <>
      <div className="flex items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackToList}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <div className="flex items-center">
          <UserAvatar user={selectedUser} size="lg" />
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
  )


  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile header when showing chat list */}
        {!showChat && (
          <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        )}

        {/* Mobile drawer for chat list */}
        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {sidebarContent}
        </MobileDrawer>

        {/* Show either chat list or selected chat */}
        {showChat ? (
          <div className="flex flex-col flex-1 overflow-hidden">{chatContent}</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 mb-2 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-800 bg-white dark:bg-gray-800 shadow-sm"
                onClick={() => handleSelectUser(user)}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                  ></span>
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.lastSeen}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                {user.unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Desktop view
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {sidebarContent}
      <div className="flex flex-col flex-1 overflow-hidden">{chatContent}</div>
    </div>
  )

  // return (
  //   <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
  //     <ChatSidebar users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
  //     <div className="flex flex-col flex-1 overflow-hidden">
  //       {selectedUser ? (
  //         <>
  //           <div className="flex items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
  //             <div className="flex items-center">
  //               {/* <div className="relative">
  //                 <Avatar className="w-10 h-10">
  //                   <AvatarImage
  //                     src={selectedUser.avatar}
  //                     alt={selectedUser.name}
  //                   />
  //                   <AvatarFallback>
  //                     {selectedUser.name.charAt(0)}
  //                   </AvatarFallback>
  //                 </Avatar>

  //                 <span
  //                   className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"
  //                     }`}
  //                 ></span>
  //               </div> */}
  //               <UserAvatar user={selectedUser} size="lg" />
  //               <div className="ml-3">
  //                 <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedUser.name}</h2>
  //                 <p className="text-sm text-gray-500 dark:text-gray-400">
  //                   {selectedUser.status === "online" ? "Online" : `Last seen ${selectedUser.lastSeen}`}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //           <ChatMessages
  //             messages={messages.filter((m) => m.userId === selectedUser.id || m.userId === "me")}
  //             currentUser={selectedUser}
  //           />
  //           <ChatInput onSendMessage={handleSendMessage} />
  //         </>
  //       ) : (
  //         <div className="flex items-center justify-center h-full">
  //           <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )
}

