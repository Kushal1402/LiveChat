import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus } from "lucide-react"


export default function NewConversationDialog({ isOpen, onClose, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample global users data - in a real app, this would come from an API
  const globalUsers = [
    {
      id: "101",
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "Just now",
      unreadCount: 0,
    },
    {
      id: "102",
      name: "David Chen",
      email: "david.chen@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "3h ago",
      unreadCount: 0,
    },
    {
      id: "103",
      name: "Sophia Rodriguez",
      email: "sophia.r@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "Just now",
      unreadCount: 0,
    },
    {
      id: "104",
      name: "James Wilson",
      email: "james.wilson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "1d ago",
      unreadCount: 0,
    },
    {
      id: "105",
      name: "Olivia Parker",
      email: "olivia.p@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: "5m ago",
      unreadCount: 0,
    },
  ]

  // Filter users based on search query
  const filteredUsers = globalUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectUser = (user) => {
    onSelectUser(user)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New message</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Invite a user to this thread. This will create a new group message.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No users found matching "{searchQuery}"</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

