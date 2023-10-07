"use client";
import React from "react";
import Loading from "@/components/loading";
import MySession from "@/models/session";
import CartItem from "@/models/cart-item";
import Link from "next/link";
import Image from "next/image";
import instance from "@/lib/axios-config";
import { CartContext } from "@/context/cart-provider";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @function CartPage
 * @description A component that renders a detailed view of a product.
 * @returns {JSX.Element} The rendered component.
 */
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

  /**
   * @async
   * @function getCart
   * @description Fetches cart data.
   * @returns {Promise<void>}
   */
  const getCart = async (): Promise<void> => {
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

  const getSubTotal = (): number => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  if (pageLoading) return <Loading />;

  if (cartItems.length === 0) {
    return (
      <>
        {/* Empty cart */}
        <div className="max-w-screen-xl mx-auto w-11/12 flex flex-col items-center justify-center h-[70vh] gap-10">
          <h1 className="font-bold text-4xl">Your cart is empty</h1>
          <Link href={"collections/tops"}>
            <Button className="px-10 py-7 rounded-none">
              Continue shopping
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-10 max-w-screen-xl mx-auto my-20 w-11/12">
        {/* Cart header */}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-4xl w-full">Your cart</h1>
          <Link
            className="whitespace-nowrap underline underline-offset-4"
            href={"/collections/tops"}
          >
            Continue shopping
          </Link>
        </div>

        {/* Cart items */}
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="text-left pb-5 font-normal">Product</th>
              <th className="text-left font-normal">
                <div className="max-w-[200px]">Quantity</div>
              </th>
              <th className="text-right font-normal">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <ProductItem
                key={item._id}
                cartItem={item}
                mySession={mySession}
                setCartItems={setCartItems}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart total */}
      <div className="flex flex-col items-end w-11/12 border-t max-w-screen-xl mx-auto">
        <div className="w-[400px] flex flex-col items-end gap-5 mt-20">
          <div className="flex items-center gap-2 text-lg">
            <p className="font-bold">Subtotal:</p>
            <p>${getSubTotal()}.00 USD</p>
          </div>
          <Button className="w-full py-7 rounded-none text-md">
            Check out
          </Button>
        </div>
      </div>
    </>
  );
};

/* ######################################## CART ITEM ######################################## */

/**
 * @interface ProductItemProps
 * @description Defines the props for the ProductItem component.
 */
interface ProductItemProps {
  cartItem: CartItem;
  mySession: MySession | null;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

/**
 * A component that renders a single product item in the cart.
 * @param props - The properties or attributes of this component.
 * @returns Rendered product item component.
 */
const ProductItem: React.FC<ProductItemProps> = ({
  cartItem,
  mySession,
  setCartItems,
}): JSX.Element => {
  // Loading states
  const [deleteCartItemLoading, setDeleteCartItemLoading] =
    React.useState<boolean>(false);

  // Custom hooks
  const { toast } = useToast();

  // Context
  const { setHasCartItems } = React.useContext(CartContext);

  /**
   * @async
   * @function deleteCartItem
   * @description Deletes a cart item.
   * @param {CartItem} item - The item to delete.
   * @returns {Promise<void>}
   */
  const deleteCartItem = async (item: CartItem): Promise<void> => {
    setDeleteCartItemLoading(true);
    try {
      // Remove item from database
      await instance.delete(`/cart/${item._id}`, {
        headers: {
          token: mySession!.jwt,
        },
      });

      // Remove item from cart
      setCartItems((prev) => {
        // Filter out the click cart item
        const newCartItems = prev.filter((item) => item._id !== cartItem._id);

        // If the new cart items length is 0, remove the hasCartItems session
        if (newCartItems.length === 0) {
          sessionStorage.removeItem("hasCartItems");
          setHasCartItems(false);
        }

        // Return the new cart items
        return newCartItems;
      });

      // Show success toaster
      toast({
        description: "Item removed from cart",
        className: "bg-green-500 text-white",
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setDeleteCartItemLoading(false);
    }
  };

  /**
   * @async
   * @function addQuantity
   * @description Increases the quantity of a cart item.
   * @param {CartItem} item - The item to update.
   * @returns {Promise<void>}
   */
  const addQuantity = async (item: CartItem): Promise<void> => {
    try {
      // Update quantity in cart
      setCartItems((prev) =>
        prev.map((item) => {
          // Update the click cart item quantity and price
          if (item._id === cartItem._id) {
            return {
              ...item,
              price: item.price + item.price / item.quantity,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }),
      );

      // Update quantity in cart in database
      await instance.patch(
        "/cart",
        {
          id: item._id,
          add: true,
          minus: false,
        },
        {
          headers: {
            token: mySession!.jwt,
          },
        },
      );
    } catch (error: any) {
      console.error(error);
    }
  };

  /**
   * @async
   * @function minusQuantity
   * @description Decreases the quantity of a cart item.
   * @param {CartItem} item - The item to update.
   * @returns {Promise<void>}
   */
  const minusQuantity = async (item: CartItem): Promise<void> => {
    try {
      // Update quantity in cart
      setCartItems((prev) =>
        prev.map((item) => {
          // Only update click cart item quantity and price if quantity is greater than 1
          if (item._id === cartItem._id && item.quantity > 1) {
            return {
              ...item,
              price: item.price - item.price / item.quantity,
              quantity: item.quantity - 1,
            };
          }
          return item;
        }),
      );

      // Update quantity in cart in database
      await instance.patch(
        "/cart",
        {
          id: item._id,
          add: false,
          minus: true,
        },
        {
          headers: {
            token: mySession!.jwt,
          },
        },
      );
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <tr>
      <td className="text-left py-5">
        <Image
          src={`/images/${cartItem.image}.png`}
          alt={cartItem.name}
          width={130}
          height={130}
        />
      </td>
      <td>
        {deleteCartItemLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <div className="text-center flex items-center max-w-[200px] gap-3">
            <div className="flex items-center justify-between border w-full py-3 px-5">
              <MinusIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => minusQuantity(cartItem)}
              />
              <p>{cartItem.quantity}</p>
              <PlusIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => addQuantity(cartItem)}
              />
            </div>
            <TrashIcon
              className="w-5 h-5 cursor-pointer"
              onClick={() => deleteCartItem(cartItem)}
            />
          </div>
        )}
      </td>
      <td className="text-right">
        <div className="flex justify-end">${cartItem.price}.00 USD</div>
      </td>
    </tr>
  );
};

export default CartPage;
