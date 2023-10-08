"use client";
import React from "react";
import Product from "@/models/product";
import Image from "next/image";
import Category from "@/models/category";
import Link from "next/link";
import Loading from "@/components/loading";
import instance from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import MySession from "@/models/session";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormInput from "@/components/form/form-input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * @function CollectionsNamePage
 * @description A page component that displays a collection of products based on the provided name parameter.
 * @param {CollectionsNamePageProps} props - Properties passed to the component.
 * @returns {JSX.Element}
 */
const CollectionsNamePage = ({
  params,
}: {
  params: { name: string };
}): JSX.Element => {
  // Param
  const { name } = params;

  // Variable states
  const [products, setProducts] = React.useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  // Loading states
  const [pageLoading, setPageLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getCategory();
  }, [dialogOpen]);

  /**
   * @function getCategory
   * @description Fetches the category data based on the name and triggers the product fetching.
   * @returns {Promise<void>}
   */
  const getCategory = async (): Promise<void> => {
    try {
      const { data } = await instance.get(`/category/${name}`);
      if (data) {
        getProduct(data);
      }
    } catch (error: any) {
      console.error("Error when getting category", error);
    } finally {
      setPageLoading(false);
    }
  };

  /**
   * @function getProduct
   * @description Fetches the products associated with a specific category and sets the product state.
   * @param {Category} category - The category for which to fetch products.
   * @returns {Promise<void>}
   */
  const getProduct = async (category: Category): Promise<void> => {
    try {
      const { data } = await instance.get(`/product/${category._id}`);
      setProducts(data);
    } catch (error: any) {
      console.error("Error when getting product", error);
    }
  };

  if (pageLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      {/** COLLECTION header */}
      <div className="flex items-center justify-between max-w-screen-xl mx-auto w-11/12 my-20">
        <h1 className="font-bold text-4xl">{name.toUpperCase()}</h1>
        {mySession?.role === "ADMIN" && (
          <Button onClick={() => setDialogOpen(true)}>Add item</Button>
        )}
      </div>

      {/** PRODUCT filters */}
      <div className="max-w-screen-xl mx-auto w-11/12 flex justify-end">
        <p className="text-slate-500">{products.length} products</p>
      </div>

      {/** PRODUCTS */}
      <div className="flex flex-col items-center justify-center mt-5 mb-20">
        <div className="flex items-center gap-5 max-w-screen-xl w-11/12 mx-auto outline-none">
          {products.map((product: Product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/** DIALOG */}
      <ProductDialog
        openDialog={dialogOpen}
        setOpenDialog={setDialogOpen}
        name={name}
        mySession={mySession}
      />
    </>
  );
};

/* ######################################## PRODUCT ITEM ######################################## */

interface ProductItemProps {
  product: Product;
}

/**
 * A component that renders a product item.
 */
const ProductItem: React.FC<ProductItemProps> = ({ product }): JSX.Element => {
  return (
    <>
      <div className="flex flex-col items-start gap-3 cursor-pointer hover:scale-105 transition ease-in-out duration-300 w-full">
        <Link
          href={`/products/${product.name}`}
          className="flex flex-col gap-3 w-full hover:underline underline-offset-4"
        >
          <Image
            src={`/images/${product.image}.png`}
            alt={product.name}
            width={300}
            height={300}
            objectFit={"contain"}
          />
          <p className="font-bold">{product.name}</p>
        </Link>
        <p>${product.price}.00 USD</p>
      </div>
    </>
  );
};

/* ######################################## PRODUCT MODAL ######################################## */

interface ProductDialogProps {
  name: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mySession: MySession | null;
}

/**
 * A component that renders a modal for adding a product.
 * @returns {JSX.Element}
 */
const ProductDialog: React.FC<ProductDialogProps> = ({
  name,
  openDialog,
  setOpenDialog,
  mySession,
}): JSX.Element => {
  // Form states
  const [productName, setProductName] = React.useState<string>("");
  const [productPrice, setProductPrice] = React.useState<string>("");
  const [productImage, setProductImage] = React.useState<string>("");
  const [productDescription, setProductDescription] =
    React.useState<string>("");
  const [submitForm, setSubmitForm] = React.useState<boolean>(false);

  // Error states
  const [productNameError, setProductNameError] = React.useState<string>("");
  const [productPriceError, setProductPriceError] = React.useState<string>("");
  const [productImageError, setProductImageError] = React.useState<string>("");
  const [productDescriptionError, setProductDescriptionError] =
    React.useState<string>("");

  // Loading states
  const [addProductLoading, setAddProductLoading] =
    React.useState<boolean>(false);

  // Custom hooks
  const { toast } = useToast();

  React.useEffect(() => {
    if (
      !productNameError &&
      !productPriceError &&
      !productImageError &&
      !productDescriptionError &&
      productName &&
      productPrice &&
      productImage &&
      productDescription
    ) {
      setSubmitForm(true);
    } else {
      setSubmitForm(false);
    }
  }, [
    productNameError,
    productPriceError,
    productImageError,
    productDescriptionError,
    productName,
    productPrice,
    productImage,
    productDescription,
  ]);

  /**
   * @function handleProductName
   * @description Handles the product name input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleProductName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setProductName(e.target.value);
    if (!e.target.value.trim()) {
      setProductNameError("Product name is required");
    } else {
      setProductNameError("");
    }
  };

  /**
   * @function handleProductImage
   * @description Handles the product image input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleProductPrice = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setProductPrice(e.target.value);
    if (!e.target.value.trim()) {
      setProductPriceError("Product price is required");
    } else if (!isValidPrice(e.target.value)) {
      setProductPriceError("Product price must be a number");
    } else {
      setProductPriceError("");
    }
  };

  /**
   * @function handleProductImage
   * @description Handles the product image input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setProductImage(e.target.value);
    if (!e.target.value.trim()) {
      setProductImageError("Product image is required");
    } else {
      setProductImageError("");
    }
  };

  /**
   * @function handleProductImage
   * @description Handles the product image input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleProductDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setProductDescription(e.target.value);
    if (!e.target.value.trim()) {
      setProductDescriptionError("Product description is required");
    } else {
      setProductDescriptionError("");
    }
  };

  /**
   * @function handleProductImage
   * @description Handles the product image input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {boolean} - Whether the price is valid or not.
   */
  const isValidPrice = (price: string): boolean => {
    return /^\d+$/.test(price);
  };

  /**
   * @function addProduct
   * @description Adds a product to the database.
   * @returns {Promise<void>}
   */
  const addProduct = async (): Promise<void> => {
    setAddProductLoading(true);
    try {
      // Get the category id
      const { data } = await instance.get(`/category/${name}`, {
        headers: {
          token: mySession!.jwt,
        },
      });

      // If there's data from the category request, add the product
      if (data) {
        console.log("Category data", data);
        await instance.post(
          "/product",
          {
            name: productName,
            price: productPrice,
            description: productDescription,
            image: productImage,
            category: data._id,
          },
          {
            headers: {
              token: mySession!.jwt,
            },
          },
        );
      }

      // Show success toaster
      toast({
        description: "Product added successfully",
        className: "bg-green-500 text-white",
      });

      // Reset the form and close modal
      resetForm();
      setOpenDialog(false);
    } catch (error: any) {
      console.error("Error when adding product", error);
      if (error.response && error.response.status === 409) {
        setProductNameError("Product name already exists");
      }
    } finally {
      setAddProductLoading(false);
    }
  };

  const resetForm = (): void => {
    setProductName("");
    setProductPrice("");
    setProductImage("");
    setProductDescription("");
    setProductNameError("");
    setProductPriceError("");
    setProductImageError("");
    setProductDescriptionError("");
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a product</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col items-start gap-5">
            {/** product name */}
            <FormInput
              placeholder={"Vintage Mocha Tee"}
              type={"text"}
              value={productName}
              onChange={handleProductName}
              error={productNameError}
            />
            {/** product price */}
            <FormInput
              placeholder={"60"}
              type={"text"}
              value={productPrice}
              onChange={handleProductPrice}
              error={productPriceError}
            />
            {/** product image */}
            <FormInput
              placeholder={"vintage_mocha_tee.png"}
              type={"text"}
              value={productImage}
              onChange={handleProductImage}
              error={productImageError}
            />
            {/** product description */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Textarea
                placeholder={
                  "Stonewashed and hand distressed\n\n50% recycled cotton, 50% organic cotton\n\nSingle T-Shirt\n\nTrue to size "
                }
                value={productDescription}
                onChange={handleProductDescription}
              />
              {productDescriptionError && (
                <p className="text-red-500">{productDescriptionError}</p>
              )}
            </div>
          </DialogDescription>
          <DialogFooter>
            {/** Cancel button */}
            <Button
              variant={"secondary"}
              onClick={() => setOpenDialog(false)}
              type="button"
            >
              Cancel
            </Button>

            {/** Submit button */}
            <Button
              type="submit"
              disabled={addProductLoading || !submitForm}
              onClick={addProduct}
            >
              {addProductLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollectionsNamePage;
