"use client";
import React from "react";
import Image from "next/image";
import Product from "@/models/product";
import MySession from "@/models/session";
import instance from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { successToast } from "@/services/toast-service";
import Loading from "@/components/loading";
import { useToast } from "@/components/ui/use-toast";

const ProductNamePage = ({ params }: { params: { name: string } }) => {
  // Path
  let { name } = params;
  name = name.split("%20").join(" ");

  // Variable states
  const [product, setProduct] = React.useState<Product>({} as Product);

  // loading state
  const [pageLoading, setPageLoading] = React.useState<boolean>(true);
  const [addToCartLoading, setAddToCartLoading] =
    React.useState<boolean>(false);

  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  // Custom hooks
  const { toast } = useToast();

  React.useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async (): Promise<void> => {
    setPageLoading(true);
    try {
      const { data } = await instance.get(`/product/name/${name}`);
      setProduct(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const addToCart = async (): Promise<void> => {
    setAddToCartLoading(true);
    try {
      await instance.post("/cart", {
        productId: product._id,
        token: mySession!.jwt,
      });
      toast({
        description: "Product added to cart",
        className: "bg-green-500 text-white",
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setAddToCartLoading(false);
    }
  };

  if (pageLoading) return <Loading />;

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
          <Button className="w-full py-6 rounded-none" onClick={addToCart}>
            {addToCartLoading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Add to cart
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductNamePage;
