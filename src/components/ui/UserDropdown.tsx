import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuContent = DropdownMenu.Content;
const DropdownMenuItem = DropdownMenu.Item;

type UserProfileDropdownType = {
  children: ReactNode;
  onSignOut: () => void;
};
const UserDropdown = ({ children, onSignOut }: UserProfileDropdownType) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="outline-none">
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          className="min-w-[185px] rounded-md bg-[#313131] bg-opacity-80 p-[5px] pt-5 pb-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <DropdownMenuItem className=" flex h-[25px] select-none items-center rounded-[3px] px-1 pl-4 font-medium text-white  outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <button className="">Profile</button>
          </DropdownMenuItem>
          <DropdownMenuItem className=" flex h-[25px] select-none items-center rounded-[3px] px-2 pl-4 font-sans font-medium text-white outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <button className="">Account Settings</button>
          </DropdownMenuItem>
          <DropdownMenu.Separator className="my-1 mx-2 ml-4 mb-2 border-[1px] border-gray-500" />
          <DropdownMenuItem className=" flex h-[25px] select-none items-center rounded-[3px] px-1 pl-4 font-medium text-red-400 outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
            <button onClick={() => onSignOut()} className="">
              Sign out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};

export default UserDropdown;
