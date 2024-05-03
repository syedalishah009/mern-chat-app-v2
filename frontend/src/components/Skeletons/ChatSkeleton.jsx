import React from "react";

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-3">
        <div className="h-12 w-14 rounded-full bg-gray-300"></div>
        <div className="w-full h-4 animate-pulse rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="h-12 w-14 rounded-full bg-gray-300"></div>
        <div className="w-full h-4 animate-pulse rounded-full bg-gray-300"></div>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="h-12 w-14 rounded-full bg-gray-300"></div>
        <div className="w-full h-4 animate-pulse rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default Skeleton;
