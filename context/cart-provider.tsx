"use client";
import React from "react";

/* ######################################## CART CONTEXT ######################################## */

type CartContextType = {
  hasCartItems: boolean;
  setHasCartItems: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CartContext = React.createContext({} as CartContextType);

/* ######################################## CART PROVIDER ######################################## */

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [hasCartItems, setHasCartItems] = React.useState<boolean>(false);

  React.useEffect(() => {
    const data = sessionStorage.getItem("hasCartItems");
    if (data) {
      setHasCartItems(true);
    }
  });

  return (
    <>
      <CartContext.Provider value={{ hasCartItems, setHasCartItems }}>
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartProvider;
