import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus } from "lucide-react"
import { dispatch } from "@/store/store"
import { clearNewUsers, fetchNewUsers } from "@/store/slices/chatSlice"
import { useSelector } from "react-redux"


export default function NewConversationDialog({ isOpen, onClose, onSelectNewConversation }) {
  const [searchQuery, setSearchQuery] = useState(null)
  const { newUsers, isFetchingUsers } = useSelector((state) => state.conversations)


  useEffect(() => {
    if (isOpen) {
      const debounceTimer = setTimeout(() => {
        try {
          dispatch(fetchNewUsers(searchQuery))
        } catch (error) {
          console.log(error);
        }
      }, 300);
      return () => {
        clearTimeout(debounceTimer)
      };
    }
  }, [searchQuery, isOpen, dispatch]);


  const handleSelectNewUser = (user) => {
    onSelectNewConversation(user)
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery(null)
    dispatch(clearNewUsers())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] sm:max-w-md sm:p-4">
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
          {
            isFetchingUsers
              ? (
                <div className="flex justify-center items-center py-10">
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )
              :
              (
                newUsers.length > 0
              )
                ? (
                  newUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                      onClick={() => handleSelectNewUser(user)}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile_picture} alt={user.username} />
                        <AvatarFallback>
                          {user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  )))
                :
                (searchQuery && newUsers.length == 0) ? (
                  <div className="flex justify-center items-center py-10">
                    <span className="text-sm text-muted-foreground">
                      No results found for "<span className="font-medium">{searchQuery}</span>"
                    </span>
                  </div>
                ) : null


          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

