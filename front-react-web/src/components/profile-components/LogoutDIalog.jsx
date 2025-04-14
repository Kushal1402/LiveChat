import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';


const LogoutDialog = ({ isOpen, onClose, onConfirm, loading }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will end your current session. You can log back in anytime.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} onClick={onClose}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={loading}
                        onClick={onConfirm}
                        className="relative"
                    >
                        {loading ? (
                            <>
                                <span className="invisible">Logout</span>
                                <Loader className="h-4 w-4 animate-spin absolute" />
                            </>
                        ) : (
                            "Logout"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default LogoutDialog