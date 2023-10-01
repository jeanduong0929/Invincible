"use client";
import React from "react";
import Loading from "@/components/loading";
import MySession from "@/models/session";
import instance from "@/lib/axios-config";
import { useSession } from "next-auth/react";
import CartItem from "@/models/cart-item";

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
      <div className="max-w-screen-xl mx-auto w-11/12 my-20">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ProductItem key={item._id} cartItem={item} />
          ))
        ) : (
          <div>Empty</div>
        )}
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
      <div>{cartItem.name}</div>
    </>
  );
};

export default CartPage;
