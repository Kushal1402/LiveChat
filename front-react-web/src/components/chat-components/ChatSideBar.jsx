import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import NewConversationDialog from "./NewConversationDialog"
import UserAvatar from "./UserAvatart"
import { dispatch } from "@/store/store"
import { logoutUser } from "@/store/slices/authSlice"
import { toast } from "@/hooks/use-toast"
import {
  Search, Plus,
  MoreVertical,
  User,
  Sun,
  Moon,
  Monitor,
  LogOutIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes"
import { useSelector } from "react-redux"
import ProfileUpdateDialog from "../profile-components/ProfileUpdateDialog"

export default function ChatSidebar({ users, selectedUser, onSelectUser }) {

  const { user } = useSelector((state) => state.auth)

  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false)
  const { setTheme, theme } = useTheme()


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

  const handleLogout = async () => {
    console.log("logout");

    try {
      const res = await dispatch(logoutUser()).unwrap()
      console.log(res);
      toast({
        title: "Logout",
        description: res?.data?.message || "User Logoed out Successfuly",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to Logout",
        variant: "destructive"
      });
    }
  }


  return (
    <div className="w-80 border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* User avatar and info remains the same */}
            <UserAvatar
              user={{ ...user, status: 'online' }}
              size="lg"
            />
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{user.username}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* Profile */}
                <DropdownMenuItem onClick={() => setIsProfileUpdateOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                {/* Theme Selection */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor className="mr-2 h-4 w-4" />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        user={user}
      />
    </div>
  )
}

