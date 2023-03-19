import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="mt-4 flex items-center justify-between rounded-full bg-primary_dark px-8 py-4 text-white">
      <nav>
        <Link href="/">Feed</Link>
      </nav>
      <div>user</div>
    </header>
  );
};

export default Header;
