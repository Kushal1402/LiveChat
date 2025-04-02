import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileTab from "./ProfileTab"
import AccountTab from "./AccountTab"
import PasswordTab from "./PasswordTab"

const ProfileUpdateDialog = ({ isOpen, onClose, user }) => {

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
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileUpdateDialog

