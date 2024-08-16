"use client";

import { CartProvider } from "@/context/CartContext";

export const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <CartProvider>{children}</CartProvider>;
};
