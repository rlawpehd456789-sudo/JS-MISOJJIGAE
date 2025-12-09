import React from "react";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";



interface InteractiveHoverButtonProps

  extends React.ButtonHTMLAttributes<HTMLButtonElement> {

  text?: string;

}



const InteractiveHoverButton = React.forwardRef<

  HTMLButtonElement,

  InteractiveHoverButtonProps

>(({ text = "Button", className, ...props }, ref) => {

  return (

    <button

      ref={ref}

      className={cn(

        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background pl-4 pr-6 py-2 text-center text-sm font-medium whitespace-nowrap",

        className,

      )}

      {...props}

    >

      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">

        {text}

      </span>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">

        <span>{text}</span>

        <ArrowRight className="w-4 h-4 flex-shrink-0" />

      </div>

    </button>

  );

});



InteractiveHoverButton.displayName = "InteractiveHoverButton";



export { InteractiveHoverButton };

