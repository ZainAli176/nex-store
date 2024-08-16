"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";

type Product = {
  id: number;
  title: string;
  image: string;
};

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products?limit=5"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "error came");
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="navbar-pad">
      <Navbar />
      <div className="flex justify-center mt-8">
        <motion.div
          className="relative overflow-hidden rounded-lg w-[80%] h-[300px] bg-gray-100 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5 }}
        >
          <motion.div
            className="flex"
            animate={{ x: [0, -100 * (products.length - 1) + "%", 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full h-full flex justify-center items-center"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
