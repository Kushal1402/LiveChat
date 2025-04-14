import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import React from "react"
import { useSelector } from "react-redux"
import { dispatch } from "@/store/store"
import { selectUpdating2FA, update2FA } from "@/store/slices/authSlice"
import { useToast } from "@/hooks/use-toast"

const SecurityTab = () => {
  const { toast } = useToast()

  const is2FAEnabled = useSelector((state) => state.auth.user?.two_factor_authentication)
  const isUpdating2FA = useSelector(selectUpdating2FA)


  const handleEnable2FA = async (checked) => {
    try {
      const res = await dispatch(update2FA({ 'two_factor_authentication': checked })).unwrap()
      console.log(res);
      toast({
        title: res?.data?.message || "2FA Updated!",
        description: "2FA Updated Succesfuly"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to Update 2FA",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">2FA Status</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handleEnable2FA}
              disabled={isUpdating2FA}
            />
          </div>

          {is2FAEnabled ? (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <ShieldCheck className="h-4 w-4" />
              Two-factor authentication is currently enabled
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
              <ShieldAlert className="h-4 w-4" />
              Two-factor authentication is not enabled
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

export default SecurityTab