"use client";
import React from "react";
import Link from "next/link";
import Loading from "../loading";
import UserDropdown from "./user-dropdown";
import Category from "@/models/category";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import instance from "@/lib/axios-config";

const Navbar = (): JSX.Element => {
  // States
  const [shopDropdown, setShopDropdown] = React.useState<boolean>(false);

  // Session
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <>
        <Loading />
      </>
    );

  return (
    <>
      <div className="w-full border-b py-5">
        {/* Navbar container */}
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto w-11/12">
          {/* Left side */}
          <LeftItems
            shopDropdown={shopDropdown}
            setShopDropdown={setShopDropdown}
          />

          {/* Right side */}
          <RightItems session={session} />

          {/* Shop dropdown */}
          {shopDropdown && <ShopDropdown />}
        </nav>
      </div>
    </>
  );
};

/* ######################################## LEFT ITEMS ######################################## */

interface LeftItemProps {
  shopDropdown: boolean;
  setShopDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftItems: React.FC<LeftItemProps> = ({
  shopDropdown,
  setShopDropdown,
}): JSX.Element => {
  // Refs
  const shopDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(e.target as Node)
      ) {
        setShopDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [shopDropdown]);

  return (
    <>
      <div className="flex items-center gap-10">
        <Link href={"/"} className="flex items-center gap-5">
          <h1 className="text-4xl font-bold">INVINCIBLE</h1>
        </Link>

        <div
          ref={shopDropdownRef}
          className="flex items-center gap-2 hover:underline underline-offset-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShopDropdown(!shopDropdown);
          }}
        >
          <p>Shop</p>
          {shopDropdown ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      </div>
    </>
  );
};

/* ######################################## RIGHT ITEMS ######################################## */

interface RightItemProps {
  session: Session | null;
}

const RightItems: React.FC<RightItemProps> = ({ session }): JSX.Element => {
  return (
    <>
      <div className="flex items-center gap-5">
        {session ? (
          <UserDropdown session={session} />
        ) : (
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </>
  );
};

/* ######################################## SHOP DROPDOWN ######################################## */

const ShopDropdown = (): JSX.Element | null => {
  // Variable states
  const [categories, setCategories] = React.useState<Category[]>([]);

  // Loading states
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await instance.get("/category");
      setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="absolute w-full border-b left-0 top-20 z-20 bg-white border-t">
        <nav className="flex items-center gap-10 max-w-screen-xl mx-auto py-3 w-11/12">
          {categories.map((categories) => (
            <Link
              key={categories._id}
              className="hover:underline underline-offset-4"
              href={`/collections/${categories.name}`}
            >
              {categories.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
