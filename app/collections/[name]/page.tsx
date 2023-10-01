"use client";
import React from "react";
import Product from "@/models/product";
import Image from "next/image";
import instance from "@/lib/axios-config";
import Category from "@/models/category";

const ProductPage = ({ params }: { params: { name: string } }): JSX.Element => {
  // Param
  const { name } = params;

  // Variable states
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async (): Promise<void> => {
    try {
      const { data } = await instance.get(`/category/${name}`);
      if (data) {
        getProduct(data);
      }
    } catch (error: any) {
      console.error("Error when getting category", error);
    }
  };

  const getProduct = async (category: Category): Promise<void> => {
    try {
      const { data } = await instance.get(`/product/${category._id}`);
      setProducts(data);
    } catch (error: any) {
      console.error("Error when getting product", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <div className="flex items-center gap-5 max-w-screen-xl w-11/12 mx-auto outline-none">
          {products.map((product: Product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

/* ######################################## PRODUCT ITEM ######################################## */

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }): JSX.Element => {
  return (
    <>
      <div className="flex flex-col items-start gap-3 cursor-pointer hover:scale-105 transition ease-in-out duration-300">
        <div className="flex flex-col gap-3 w-full hover:underline underline-offset-4">
          <Image
            src={`/images/${product.image}.png`}
            alt={product.name}
            width={300}
            height={300}
            objectFit={"contain"}
          />
          <p className="font-bold">{product.name}</p>
        </div>
        <p>${product.price}.00 USD</p>
      </div>
    </>
  );
};

export default ProductPage;
