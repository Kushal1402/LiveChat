import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import React from "react"

const SecurityTab = () => {
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Mock data - replace with real data from your API
  const connectedApps = [
    { id: 1, name: "Google Workspace", permissions: "Read-only access" },
    { id: 2, name: "Slack", permissions: "Post messages" }
  ]

  const handleEnable2FA = async (checked) => {
    setIsLoading(true)
    try {
      // Add your 2FA enable/disable logic here
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIs2FAEnabled(checked)
    } finally {
      setIsLoading(false)
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
              disabled={isLoading}
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

      {/* Connected Applications Card */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectedApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.permissions}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm">
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Security Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Last Password Change</h3>
              <p className="text-sm text-muted-foreground">
                15 days ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Account Recovery</h3>
              <p className="text-sm text-muted-foreground">
                Last updated 1 month ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update Recovery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityTab