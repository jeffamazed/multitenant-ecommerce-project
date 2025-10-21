import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const TooltipCustom = ({
  trigger,
  content,
  sideOffset,
  alignOffset,
  side,
  align,
}: {
  trigger: React.ReactNode;
  content: string;
  sideOffset?: number;
  alignOffset?: number;
  side?: "bottom" | "left" | "top" | "right";
  align?: "center" | "start" | "end";
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
        className="text-xs font-semibold select-none"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipCustom;
