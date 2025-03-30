import React from "react";
import { Skeleton } from "./ui/skeleton";
const CalendarSkeleton = () => {
  return (
    <div className="w-full h-[85vh] overflow-hidden">
      <div className="flex justify-between items-center mb-4 p-4 border-b">
        <Skeleton className="h-12 w-30" />
        <Skeleton className="h-12 w-50" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-7 ">
        {Array(7)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-8 rounded-sm border dark:border-black border-white  w-full" />
          ))}

        {Array(42)
          .fill(null)
          .map((_, i) => (
            <div key={`cell-${i}`} className="aspect-square">
              <Skeleton className="h-full w-full rounded-sm border dark:border-black border-white" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CalendarSkeleton;
