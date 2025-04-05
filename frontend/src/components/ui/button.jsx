import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cn } from "/src/lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            " text-white hover:bg-[#7a7f88]":
              variant === "default",
            "bg-red-600 text-white hover:bg-red-700":
              variant === "destructive",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100":
              variant === "outline",
            "bg-transparent text-gray-700 hover:bg-gray-100":
              variant === "ghost",
            "h-9 rounded-md px-3": size === "sm",
            "h-10 px-4 py-2": size === "default",
            "h-11 rounded-md px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
