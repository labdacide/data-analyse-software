import { ReactNode } from "react";
import { Info } from "react-feather";

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group">
      <span className="text-gray-500">
        <Info size={16} />
      </span>
      <div className="absolute z-10 invisible left-0 bottom-2 translate-x-5 group-hover:visible">
        <div className="bg-white shadow rounded border border-gray-300 px-2 pb-0.5 w-max max-w-xs">
          <span className="text-xs text-gray-600 font-light">{text}</span>
        </div>
      </div>
    </div>
  );
}
