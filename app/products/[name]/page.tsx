"use client";
import React from "react";
import Image from "next/image";
import Product from "@/models/product";
import instance from "@/lib/axios-config";
import { Button } from "@/components/ui/button";

const ProductNamePage = ({ params }: { params: { name: string } }) => {
  // Path
  let { name } = params;
  name = name.split("%20").join(" ");

  // Variable states
  const [product, setProduct] = React.useState<Product>({} as Product);

  React.useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async (): Promise<void> => {
    try {
      const { data } = await instance.get(`/product/name/${name}`);
      setProduct(data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex max-w-screen-xl mx-auto w-11/12 my-20 gap-10">
        <Image
          src={`/images/${product.image}.png`}
          alt={product.name}
          width={700}
          height={700}
        />

        <div className="flex flex-col gap-5 items-start w-full">
          <h2 className="px-20 py-2 bg-[#f0f0f0]">MADE IN USA</h2>
          <h1 className="font-bold text-2xl">{product.name}</h1>
          <h3 className="text-xl">${product.price}.00 USD</h3>
          <Button className="w-full py-6 rounded-none">Add to cart</Button>
        </div>
      </div>
    </>
  );
};

export default ProductNamePage;
