import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const TooltipCustom = ({
  trigger,
  content,
  sideOffset,
  alignOffset,
  side,
  align,
  className,
}: {
  trigger: React.ReactNode;
  content: string;
  sideOffset?: number;
  alignOffset?: number;
  side?: "bottom" | "left" | "top" | "right";
  align?: "center" | "start" | "end";
  className?: string;
}) => {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild aria-describedby={undefined}>
        {trigger}
      </TooltipTrigger>
      <TooltipContent
        sideOffset={sideOffset}
        align={align}
        side={side}
        alignOffset={alignOffset}
        className={cn(
          "text-xs font-semibold select-none bg-zinc-100/90 border text-foreground max-sm:hidden",
          className
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipCustom;
