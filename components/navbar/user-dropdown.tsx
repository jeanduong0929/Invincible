import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LogOutIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { GearIcon } from "@radix-ui/react-icons";

interface UserDropdownProps {
  session: Session | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  session,
}): JSX.Element => {
  const handleSignOut = (): void => {
    if (session) {
      signOut();
    }
  };

  const getInitials = (): string => {
    const email = session?.user?.email as string;
    return email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ShoppingBagIcon className="h-4 w-4 mr-2" />
            Cart
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GearIcon className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserDropdown;
