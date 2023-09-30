import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        {/** Image */}
        <img
          className="w-full object-cover object-center h-[93vh]"
          src="https://strawberry.ski/cdn/shop/files/08-15-23-9_6111bfa1-1791-4079-8f1f-8f51f5a8b412.jpg?v=1694804072&width=1500"
        />

        {/** Shop button */}
        <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[50px] bg-white text-black hover:bg-white hover:text-black hover:scale-105 transition ease-in-out duration-200 rounded-none text-lg">
          SHOP
        </Button>
      </div>
    </>
  );
}
