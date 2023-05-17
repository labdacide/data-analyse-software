import type { ReactNode } from "react";
import classNames from "classnames";
import { useOutsideClick } from "@/hooks";

interface DropdownProps {
    visible: boolean;
    children: ReactNode;
    className?: string;
    close: () => void;
}

export default function Dropdown({
    children,
    close,
    className = "",
    visible = false,
}: DropdownProps) {
    const ref = useOutsideClick(close);
    if (!visible) return null;
    return (
        <div
            ref={ref}
            className={classNames(
                "absolute z-20 translate-y-1 bg-white rounded-md border shadow-md w-max max-w-sm overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    );
}
