import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="fixed w-full h-full bg-white bg-opacity-40 backdrop-blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <Loader2 className="animate-spin w-20 h-20 text-slate-800" />
      </div>
    </>
  );
};

export default Loading;
