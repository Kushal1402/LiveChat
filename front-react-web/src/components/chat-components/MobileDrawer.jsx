import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"



export function MobileDrawer({ isOpen, onClose, children }) {
    const [mounted, setMounted] = useState(false)

    // Handle body scroll lock
    useEffect(() => {
        setMounted(true)

        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    if (!mounted) return null

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="absolute top-4 right-4">
                    <Button size="icon" variant="ghost" onClick={onClose}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <div className="h-full overflow-y-auto">{children}</div>
            </div>
        </>
    )
}

