import { SearchIcon, ShoppingBagIcon, WebhookIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <>
      <div className="w-full border-b">
        {/* Navbar container */}
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto py-[3vh]">
          {/* Left side */}
          <Link href={"/"} className="flex items-center gap-5">
            <WebhookIcon className="h-10 w-10" />
            <h1 className="text-4xl font-bold">INVINCIBLE</h1>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <SearchIcon className="h-5 w-5" />
            <ShoppingBagIcon className="h-6 w-6" />

            {/* Login button */}
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
