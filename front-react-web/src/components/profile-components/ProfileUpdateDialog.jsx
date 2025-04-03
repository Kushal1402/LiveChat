import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileTab from "./ProfileTab"
import AccountTab from "./AccountTab"
import PasswordTab from "./PasswordTab"
import { useEffect } from "react"
import { dispatch } from "@/store/store"
import { getProfile } from "@/store/slices/authSlice"
import SecurityTab from "./SecurityTab"

const ProfileUpdateDialog = ({ isOpen, onClose, user }) => {
  useEffect(() => {
    if (isOpen) {
      dispatch(getProfile())
    }
  }, [isOpen])
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Update Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>

          </TabsList>

          {/* Profile_Tab */}
          <TabsContent value="profile" className="space-y-4 py-4">
            <ProfileTab user={user} />
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 py-4">
            <AccountTab />
          </TabsContent>

          <TabsContent value="password" className="space-y-4 py-4">
            <PasswordTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 py-4">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileUpdateDialog

