"use client";
import instance from "@/lib/axios-config";
import Product from "@/models/product";
import React from "react";

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
      <div>{product.name}</div>
    </>
  );
};

export default ProductNamePage;
