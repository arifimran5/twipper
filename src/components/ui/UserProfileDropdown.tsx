import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuContent = DropdownMenu.Content;
const DropdownMenuItem = DropdownMenu.Item;

type UserProfileDropdownType = {
  children: ReactNode;
};
const UserDropdown = ({ children }: UserProfileDropdownType) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="outline-none">
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          className="min-w-[185px] rounded-md bg-[#313131] p-[5px] pb-3 pt-5 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          <DropdownMenuItem className="flex  select-none items-center rounded-[3px] px-1  py-1 pl-3 font-medium text-white  outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <Link
              href={`/@${session?.user.username}`}
              className="inline-flex items-center gap-2"
            >
              <span>
                <User className="w-5" />
              </span>
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className=" flex select-none items-center rounded-[3px] px-2 py-1 pl-3 font-sans font-medium text-white outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <Link
              href={`/@${session?.user.username}/settings`}
              className="inline-flex items-center gap-2"
            >
              <span>
                <Settings className="w-5" />
              </span>
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenu.Separator className="mx-2 my-1 mb-2 ml-4 border-[1px] border-gray-500" />
          <DropdownMenuItem className=" flex select-none items-center rounded-[3px] px-1 py-1 pl-3 font-medium text-red-400 outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <button
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2"
            >
              <span>
                <LogOut className="w-5" />
              </span>
              Sign out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};

export default UserDropdown;
