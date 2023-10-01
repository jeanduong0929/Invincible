"use client";
import React from "react";
import Loading from "@/components/loading";
import MySession from "@/models/session";
import CartItem from "@/models/cart-item";
import Link from "next/link";
import Image from "next/image";
import instance from "@/lib/axios-config";
import { useSession } from "next-auth/react";

const CartPage = (): JSX.Element => {
  // Variable states
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  // Loading states
  const [pageLoading, setPageLoading] = React.useState<boolean>(true);

  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  React.useEffect(() => {
    if (session) {
      getCart();
    }
  }, [session]);

  const getCart = async () => {
    setPageLoading(true);
    try {
      const { data } = await instance.get("/cart", {
        headers: {
          token: mySession!.jwt,
        },
      });
      setCartItems(data);
    } catch (error: any) {
    } finally {
      setPageLoading(false);
    }
  };

  if (pageLoading) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-10 max-w-screen-xl mx-auto my-20 w-11/12">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-4xl w-full">Your cart</h1>
          <Link
            className="whitespace-nowrap underline underline-offset-4"
            href={"/collections/topics"}
          >
            Continue shopping
          </Link>
        </div>
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="text-left">Product</th>
              <th className="text-center">Quantity</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <ProductItem key={item._id} cartItem={item} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ######################################## CART ITEM ######################################## */

interface ProductItemProps {
  cartItem: CartItem;
}

const ProductItem: React.FC<ProductItemProps> = ({ cartItem }): JSX.Element => {
  return (
    <>
      <tr>
        <td className="text-left py-5">
          <Image
            src={`/images/${cartItem.image}.png`}
            alt={cartItem.name}
            width={100}
            height={100}
          />
        </td>
        <td className="text-center">1</td>
        <td className="text-right">${cartItem.price}.00 USD</td>
      </tr>
    </>
  );
};

export default CartPage;
