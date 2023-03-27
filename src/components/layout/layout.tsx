import React from "react";
import Header from "./header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-[47rem] px-4">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
