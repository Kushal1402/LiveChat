import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfileUpdateDialog({ isOpen, onClose, currentUser }) {
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    status: currentUser.status || 'online'
  })

  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = () => {
    // In a real app, you would send this data to your API
    console.log("Profile update:", profileData)
    console.log("New avatar:", avatarPreview)
    onClose()
  }

  const handlePasswordUpdate = () => {
    // In a real app, you would validate and send this data to your API
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    console.log("Password update:", {
      currentPassword: profileData.currentPassword,
      newPassword: profileData.newPassword,
    })
    onClose()
  }

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

          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt={currentUser.name} />
                  <AvatarFallback className="text-lg">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">Click the camera icon to upload a new profile picture</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} />
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={profileData.status}
                  onValueChange={(value) => setProfileData({ ...profileData, status: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Status</SelectLabel>
                      <SelectItem value="online">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Online
                        </div>
                      </SelectItem>
                      <SelectItem value="away">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500" />
                          Away
                        </div>
                      </SelectItem>
                      <SelectItem value="busy">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Busy
                        </div>
                      </SelectItem>
                      <SelectItem value="offline">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-500" />
                          Offline
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>


              <Button onClick={handleProfileUpdate} className="w-full">
                Update Profile
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>
                  Update your email address. You'll need to verify any new email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate}>Update Email</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password. After saving, you'll be logged out and will need to sign in with your new
                  password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePasswordUpdate}>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

