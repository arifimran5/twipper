import React from "react";
import Header from "./header";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={poppins.className}>
      <div className="mx-auto max-w-[47rem] px-4">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
