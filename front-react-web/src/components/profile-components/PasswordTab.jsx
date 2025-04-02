import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { updatePasswordSchema } from '@/schema/formSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ReloadIcon } from '@radix-ui/react-icons'
import { dispatch } from '@/store/store'
import { selectPasswordUpdating, updatePassword } from '@/store/slices/authSlice'
import { useToast } from "@/hooks/use-toast"

const PasswordTab = () => {
    const { toast } = useToast()
    const isUpdatingPassword = useSelector(selectPasswordUpdating);


    const onSubmit = async (data) => {
        try {
            const res = await dispatch(updatePassword({ old_password: data.currentPassword, new_password: data.newPassword })).unwrap()
            console.log(res);
            toast({
                title: "Password Updated!",
                description: res?.data?.message || "New Password Updated Succesfuly"
            })
        }
        catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error || "Failed to Update Password",
                variant: "destructive"
            });
        }
    }
    const passwordForm = useForm({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password. After saving, you'll be logged out and will need to sign in with your new password.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={passwordForm.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                {...passwordForm.register('currentPassword')}
                            />
                            {passwordForm.formState.errors.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordForm.formState.errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                {...passwordForm.register('newPassword')}
                            />
                            {passwordForm.formState.errors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordForm.formState.errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                {...passwordForm.register('confirmPassword')}
                            />
                            {passwordForm.formState.errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordForm.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full"
                        disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? (
                                <div className="flex items-center gap-2">
                                    <ReloadIcon className="h-4 w-4 animate-spin" />
                                    Updating...
                                </div>
                            ) : (
                                "Update Password"
                            )}</Button>

                    </CardFooter>
                </form>
            </Card>
        </>
    )
}

export default PasswordTab