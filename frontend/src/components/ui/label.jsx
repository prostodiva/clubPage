"use client"

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "/src/lib/utils";

function Label({
  className,
  ...props
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props} />
  );
}

export { Label };

