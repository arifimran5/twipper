import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserDropdown from "../ui/UserProfileDropdown";
import Image from "next/image";
import { cn } from "@/utils/cn";

const Header = () => {
  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleSetScrollY = () => {
      setScrollY(window.scrollY);
    };

    if (typeof window != undefined) {
      window.addEventListener("scroll", handleSetScrollY);
    }
    return () => window.removeEventListener("scroll", handleSetScrollY);
  }, [scrollY]);

  if (!session?.user) return <div></div>;

  const user = session.user;

  const isAtTop = scrollY == 0;

  return (
    <>
      <header
        className={cn(
          "navbar sticky top-2 z-[9999] mt-4 flex items-center justify-between rounded-full bg-gradient-to-t from-primary_dark via-slate-900 to-slate-800 px-8 py-4 text-white transition-opacity duration-150 ease-out",
          isAtTop ? "" : "bg-primary_dark/80 backdrop-blur-sm"
        )}
      >
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
    </>
  );
};

export default Header;
