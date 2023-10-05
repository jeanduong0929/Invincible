"use client";
import React from "react";

/* ######################################## CART CONTEXT ######################################## */

type CartContextType = {
  cartItems: number;
  setCartItems: React.Dispatch<React.SetStateAction<number>>;
};

export const CartContext = React.createContext({} as CartContextType);

/* ######################################## CART PROVIDER ######################################## */

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = React.useState<number>(0);

  React.useEffect(() => {
    const data = sessionStorage.getItem("cartItems");
    if (data) {
      setCartItems(Number(data));
    }
  }, []);

  return (
    <>
      <CartContext.Provider value={{ cartItems, setCartItems }}>
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartProvider;
