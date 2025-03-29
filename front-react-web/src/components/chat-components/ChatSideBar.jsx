import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings, Plus, Edit2 } from "lucide-react"
import { useState } from "react"
import NewConversationDialog from "./NewConversationDialog"
import ProfileUpdateDialog from "./ProfileUpdateDialog"
import UserAvatar from "./UserAvatart"


export default function ChatSidebar({ users, selectedUser, onSelectUser }) {
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false)

  // Current user profile (in a real app, this would come from authentication)
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  }

  const handleAddNewUser = (user) => {
    // Check if user already exists in the list
    const existingUser = users.find((u) => u.id === user.id)
    if (!existingUser) {
      // In a real app, you would call a function passed from the parent to add the user
      onSelectUser(user)
    } else {
      onSelectUser(existingUser)
    }
  }

  return (
    <div className="w-80 border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserAvatar
              user={{
                id: "current",
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.avatar,
                status: currentUser.status,
                lastSeen: "Now",
                unreadCount: 0,
              }}
              size="lg"
            />
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{currentUser.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => setIsProfileUpdateOpen(true)}>
            <Settings style={{ width: "20px", height: "20px" }} />
          </Button>

        </div>
      </div>

      {/* Messages Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
          <div className="flex">
            {/* <Button size="icon" variant="ghost" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button> */}
            <Button size="icon" variant="ghost" className="h-8 w-8 ml-1" onClick={() => setIsNewConversationOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations"
            className="pl-9 bg-gray-100 dark:bg-gray-700 border-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto flex-1">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedUser?.id === user.id ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            onClick={() => onSelectUser(user)}
          >
            <UserAvatar user={user} />
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.lastSeen}</span>
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

      {/* Dialogs */}
      <NewConversationDialog
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        onSelectUser={handleAddNewUser}
      />

      <ProfileUpdateDialog
        isOpen={isProfileUpdateOpen}
        onClose={() => setIsProfileUpdateOpen(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

