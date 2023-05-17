import React from "react";
import classNames from "classnames";

const Skeleton: React.FC<{ className: string | string[] }> = ({
    className = "",
}) => {
    if (typeof className === "string") {
        return (
            <span
                className={classNames(
                    "bg-gray-100 skeleton-box inline-block rounded-sm",
                    className
                )}
            />
        );
    } else {
        return (
            <>
                {className.map((csx, index) => (
                    <span
                        key={index}
                        className={classNames(
                            "bg-gray-100 skeleton-box inline-block rounded-sm",
                            csx
                        )}
                    />
                ))}
            </>
        );
    }
};

export default Skeleton;
