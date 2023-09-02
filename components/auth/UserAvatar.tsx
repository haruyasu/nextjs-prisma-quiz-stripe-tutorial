"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type User } from "next-auth"
import { type AvatarProps } from "@radix-ui/react-avatar"
import Image from "next/image"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}

// ユーザーアバター
const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={user.image}
            alt="avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
