import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import UserDropdown from "../ui/UserProfileDropdown";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();

  if (!session?.user) return <div></div>;

  const user = session.user;

  return (
    <header className="mt-4 flex items-center justify-between rounded-full bg-primary_dark px-8 py-4 text-white">
      <nav>
        <Link href="/">Feed</Link>
      </nav>
      <div className="inline-flex">
        <UserDropdown>
          {!user.image && (
            <div className="h-10 w-10 rounded-full bg-gray-600 sm:h-10 sm:w-12"></div>
          )}
          {user.image && (
            <Image
              width={40}
              height={40}
              className="rounded-full"
              src={user.image}
              alt="userprofile"
            />
          )}
        </UserDropdown>
      </div>
    </header>
  );
};

export default Header;
