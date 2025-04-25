
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type FriendAvatarProps = {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
};

const FriendAvatar: React.FC<FriendAvatarProps> = ({ name, color, size = "md" }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={sizeClass[size]}>
      <AvatarFallback style={{ backgroundColor: color, color: "#fff" }}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default FriendAvatar;
