import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import NewConversationDialog from "./NewConversationDialog"
import UserAvatar from "./UserAvatart"
import { dispatch } from "@/store/store"
import { logoutUser, selectIsLoggingOut } from "@/store/slices/authSlice"
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
import LogoutDialog from "../profile-components/LogoutDIalog"
import { fetchConversations, messageReceived, prependMessage, selectConversationListItems } from "@/store/slices/chatSlice"
import MemoizedConversationItem from "./MemoizedConversationItem"
import { fakeMessages, messageAdded, messagesReceived } from "@/store/slices/messages.slice"
import { useSocketContext } from "@/context/SocketContext"

export default function ChatSidebar({ onSelectUser }) {
  const { addListener, removeListener } = useSocketContext();
  const { user } = useSelector((state) => state.auth)
  const { activeConversation } = useSelector((state) => state.conversations)

  // console.log(activeConversation);
  // console.log(user);
  useEffect(() => {
    dispatch(messagesReceived(fakeMessages));
    // const handleMessageReceived = (message) => {
    //   // console.log('📨 Message received via socket:', message);

    //   // dispatch(messageAdded(message)); // for add message in message slice 

    //   // dispatch(prependMessage({
    //   //   conversationId: message.conversationId,
    //   //   messageId: message.id
    //   // })); // for add messaage in conversion_list

    //   dispatch(messageReceived(message)) // for add message in last_message 

    // };
    dispatch(messagesReceived(fakeMessages)) // for add more... messages in message slice 
    fakeMessages.forEach((msg) => {
      dispatch(prependMessage({
        conversationId: msg.conversationId,
        messageId: msg.id
      })); // for add messaage in conversion_list
    })

    // Add the socket listener
    // addListener('message_received', handleMessageReceived);


    // Simulate incoming message manually
    // const fakeMessage = {
    //   id: 'mid2',
    //   conversationId: '5',
    //   text: '🔥 This is a fake message from u7',
    //   senderId: 'u6',
    //   receiverId: '67eb104b6d48a231b8de76bf',
    //   createdAt: new Date().toISOString(),
    // };

    // Delay it a bit to simulate async behavior
    // setTimeout(() => {
    // handleMessageReceived(fakeMessage);
    // }, 2000);

    // Cleanup on unmount
    return () => {
      removeListener('message_received');
    };
  }, [addListener, removeListener, dispatch]);



  // const conversations = useSelector(selectAllConversations);
  // const conversations = useSelector(selectEnrichedConversations);
  const conversations = useSelector(selectConversationListItems);

  // console.log(conversations);
  const isLoggingOut = useSelector(selectIsLoggingOut)

  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false)
  const [logoutModel, setLogoutModel] = useState(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    dispatch(fetchConversations())
  }, [])

  const handleAddNewUser = (user) => {
    // Check if user already exists in the list
    // const existingUser = users.find((u) => u.id === user.id)
    // if (!existingUser) {
    //   // In a real app, you would call a function passed from the parent to add the user
    //   onSelectUser(user)
    // } else {
    //   onSelectUser(existingUser)
    // }
  }

  const handleLogout = async () => {

    try {
      const res = await dispatch(logoutUser()).unwrap()
      console.log(res);
      toast({
        title: "Logout",
        description: res?.message || "User Logoed out Successfuly",
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
                  onClick={() => setLogoutModel(true)}
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
        {conversations.map((conv) => (
          <MemoizedConversationItem
            key={conv.id}
            conv={conv}
            activeConversation={activeConversation}
            onSelectUser={onSelectUser}
          />
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
      />

      <LogoutDialog
        isOpen={logoutModel}
        onClose={() => setLogoutModel(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />


    </div>
  )
}

