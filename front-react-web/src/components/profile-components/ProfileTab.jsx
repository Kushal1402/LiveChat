import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Briefcase, Camera, CheckCircle2, Clock, Coffee, Gamepad2, Moon, BookOpen, Projector } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { dispatch } from '@/store/store'
import { selectProfileUpdating, updateProfile } from '@/store/slices/authSlice'
import { useToast } from "@/hooks/use-toast"
import { useSelector } from 'react-redux'
import { ReloadIcon } from '@radix-ui/react-icons'


const statusOptions = [
    { value: "Available", label: "Available", icon: CheckCircle2, color: "text-green-500" },
    { value: "Busy", label: "Busy", icon: Clock, color: "text-yellow-500" },
    { value: "Away", label: "Sleeping", icon: Moon, color: "text-purple-500" },
    { value: "school", label: "At School", icon: BookOpen, color: "text-green-500" },
    { value: "work", label: "At Work", icon: Briefcase, color: "text-blue-500" },
    { value: "meeting", label: "In a Meeting", icon: Projector, color: "text-red-900" },
    { value: "break", label: "On a Break", icon: Coffee, color: "text-orange-500" },
    { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-red-500" }
]

const ProfileTab = ({ user }) => {
    const { toast } = useToast()
    const [avatarPreview, setAvatarPreview] = useState(user.profile_picture)
    const isProfileUpdating = useSelector(selectProfileUpdating)

    const profileUpdateForm = useForm({
        defaultValues: {
            username: user.username || '',
            profile_picture: undefined,
            status: user.about || ''
        },
    })

    const { register, handleSubmit, setValue, getValues } = profileUpdateForm;

    const onSubmit = async (data) => {
        let formData = new FormData()

        formData.append('username', data.username)
        formData.append('about', data.status)
        if (getValues('profile_picture')) {
            formData.append('profile_picture', data.profile_picture)
        } else {
            formData.append('profile_picture', user.profile_picture)
        }

        try {
            const res = await dispatch(updateProfile(formData)).unwrap()
            toast({
                title: "Updated!",
                description: res?.message
            })
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to Update Profile",
                variant: "destructive"
            });
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue("profile_picture", file);
            const reader = new FileReader()
            reader.onload = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    };
    return (
        <>
            <FormProvider {...profileUpdateForm}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarPreview} alt={user.username} />
                                <AvatarFallback className="text-lg">
                                    {user.username
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
                                {...register('profile_picture')}
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">Click the camera icon to upload a new profile picture</p>
                    </div>

                    <div className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username">User Name</Label>
                            <Input
                                id="username"
                                {...register('username')}
                            />
                            {profileUpdateForm.formState.errors.username && (
                                <p className="text-sm text-red-500">
                                    {profileUpdateForm.formState.errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Controller
                                name="status"
                                control={profileUpdateForm.control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>User Status</SelectLabel>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <option.icon className={`h-4 w-4 ${option.color}`} />
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}

                            />
                            {profileUpdateForm.formState.errors.status && (
                                <p className="text-sm text-red-500">
                                    {profileUpdateForm.formState.errors.status.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isProfileUpdating}>
                            {isProfileUpdating ? (
                                <div className="flex items-center gap-2">
                                    <ReloadIcon className="h-4 w-4 animate-spin" />
                                    Updating...
                                </div>
                            ) : (
                                "Update Profile"
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default ProfileTab
