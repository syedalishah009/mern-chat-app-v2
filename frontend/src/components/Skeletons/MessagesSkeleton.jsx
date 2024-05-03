import React from "react";

const MessagesSkeleton = () => {
  return (
    <div className="w-full mb-40">
      <div className="flex flex-col gap-y-4">
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
      </div>
      <div className="flex flex-col gap-y-4 float-right">
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
        <div className="w-48 h-3 rounded-full animate-pulse bg-gray-300"></div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;
