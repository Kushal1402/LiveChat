import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export default function UserAvatar({ user, size = "md" }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const statusSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  }

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span
        className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} rounded-full border-2 border-white dark:border-gray-800 ${
          user.status === "online" ? "bg-green-500" : "bg-gray-400"
        }`}
      ></span>
    </div>
  )
}

