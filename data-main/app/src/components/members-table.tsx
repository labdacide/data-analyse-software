import { useState, useRef } from "react";
import { Check, ChevronRight, Copy } from "react-feather";
import { Skeleton } from "@/components/ui";
import classNames from "classnames";

interface ColProps {
    name: string;
    field: string;
    onClick: ({ field, order }?: { field: string; order: 1 | -1 }) => void;
    border: boolean;
}

const Col = ({ name, field, onClick, border }: ColProps) => {
    const [order, setOrder] = useState<number>();
    function handleClick() {
        if (order === undefined) {
            onClick({ field, order: 1 });
            setOrder(1);
        } else if (order === 1) {
            onClick({ field, order: -1 });
            setOrder(-1);
        } else if (order === -1) {
            onClick(undefined);
            setOrder(undefined);
        }
    }
    return (
        <th
            onClick={handleClick}
            className={classNames(
                "font-normal text-xs py-3 px-4 text-left cursor-pointer whitespace-nowrap",
                border ? "text-left border-r" : "text-right"
            )}
        >
            <span>{order === 1 ? "▲" : order === -1 ? "▼" : ""}</span>{" "}
            <span>{name}</span>
        </th>
    );
};

interface MembersTableProps {
    loading: boolean;
    members: Holder[];
    onColumnClick: (args?: { field: string; order: -1 | 1 }) => void;
    blur?: true;
}

export default function MembersTable({
    members,
    onColumnClick,
    loading,
    blur,
}: MembersTableProps) {
    return (
        <div className="max-w-5xl mx-auto border rounded-lg overflow-x-hidden bg-white">
            <div className={blur ? "blur-sm" : ""}>
                <table className="w-full overflow-x-auto">
                    <thead className="text-gray-400">
                        <tr className="border-b">
                            {[
                                { name: "Address", field: "address" },
                                { name: "Name", field: "name" },
                                { name: "Net worth", field: "netWorth" },
                                { name: "Balance", field: "balance" },
                                {
                                    name: "Followers",
                                    field: "twitter.followers",
                                },
                                {
                                    name: "Followings",
                                    field: "twitter.followings",
                                },
                            ].map(({ name, field }, index) => (
                                <Col
                                    key={index}
                                    name={name}
                                    field={field}
                                    onClick={onColumnClick}
                                    border={index === 0}
                                />
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600">
                        {loading ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : members.length > 0 ? (
                            members.map((holder, index) => (
                                <MemberRow key={index} holder={holder} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10}>
                                    <div className="py-2">
                                        <p className="text-center text-xs text-gray-400">
                                            No results found
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const SkeletonRow = ({ cols = 7 }: { cols?: number }) => (
    <tr>
        <td className="border-r py-1 px-4">
            <Skeleton className="h-4 w-full" />
        </td>
        {Array.from(Array(cols - 1).keys()).map((index) => (
            <td key={index} className="py-1 px-4">
                <Skeleton className="h-4 w-12" />
            </td>
        ))}
    </tr>
);

interface Holder {
    address: string;
    collection?: any[];
    [other: string]: any;
}

const MemberRow = ({ holder }: { holder: Holder }) => {
    const ref = useRef(null);
    const [toggle, setToggle] = useState(false);
    const [copied, setCopied] = useState(false);

    return (
        <>
            <tr
                ref={ref}
                className="group hover:bg-neutral-50 text-xs cursor-pointer"
                onClick={() => setToggle(!toggle)}
            >
                <td className="p-2 border-r flex items-center space-x-2">
                    <div>
                        <ChevronRight
                            size={14}
                            className={`transition text-white group-hover:text-gray-400 transform ${
                                toggle ? "rotate-90" : "rotate-0"
                            }`}
                        />
                    </div>
                    <div className="w-40 truncate flex-1">{holder.address}</div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(holder.address);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2_000);
                        }}
                        className="p-1 rounded bg-transparent hover:bg-gray-100"
                    >
                        {copied ? (
                            <Check size={12} className="text-green-500" />
                        ) : (
                            <Copy
                                size={12}
                                className={`transition text-white group-hover:text-gray-400`}
                            />
                        )}
                    </button>
                </td>

                <td className="py-2 px-4 text-right">
                    {holder.name ||
                        holder.twitter?.name ||
                        holder.twitter?.screen_name ||
                        holder.discord?.username ||
                        holder.discord?.name ||
                        "–"}
                </td>
                <td className="py-2 px-4 text-right">
                    {holder.netWorth
                        ? typeof holder.netWorth === "number"
                            ? holder.netWorth.toFixed(2)
                            : `$${holder.netWorth.usd.toFixed(2)}`
                        : "–"}
                </td>
                <td className="py-2 px-4 text-right">
                    {holder.balance && holder.balance.usd
                        ? `$${holder.balance.usd.toFixed(2)}`
                        : "–"}
                </td>
                <td className="py-2 px-4 text-right">
                    {holder.twitter?.followers || "–"}
                </td>
                <td className="py-2 px-4 text-right">
                    {holder.twitter?.followings || "–"}
                </td>
            </tr>
            {toggle ? (
                <tr className="border-y">
                    <td colSpan={20}>
                        <div className="flex divide-x text-xs">
                            <div className="w-64 py-3 px-4 flex-1 flex flex-col space-y-1">
                                <header className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        Portfolio
                                    </span>
                                    <div className="text-xs text-gray-400 truncate w-24 font-light">
                                        {holder.address}
                                    </div>
                                </header>
                                <div className="px-2 py-1">
                                    {holder.collection &&
                                        holder.collection
                                            .sort(
                                                (a, b) =>
                                                    b.floorprice - a.floorprice
                                            )
                                            .slice(0, 3)
                                            .map((asset, index) => (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-2"
                                                >
                                                    <span className="truncate overflow-hidden">
                                                        {asset.name ||
                                                            asset.address}
                                                        {asset.balance &&
                                                            asset.balance >
                                                                1 && (
                                                                <small className="ml-2 text-gray-300 text-xs">
                                                                    x
                                                                    {
                                                                        asset.balance
                                                                    }
                                                                </small>
                                                            )}
                                                    </span>
                                                    <span className="justify-self-end text-gray-400">
                                                        {asset.floorprice
                                                            ? (
                                                                  asset.floorprice *
                                                                  (asset.balance ||
                                                                      1)
                                                              ).toFixed(2)
                                                            : "–"}{" "}
                                                        {asset.currency}
                                                    </span>
                                                </div>
                                            ))}
                                    {holder.collection &&
                                    holder.collection.length > 3 ? (
                                        <p className="text-gray-400 mt-1">
                                            {holder.collection.length - 3} other
                                            collections
                                            {/* ({holder.collection
                                                .sort(
                                                    (a, b) =>
                                                        b.floorprice -
                                                        a.floorprice
                                                )
                                                .slice(3, 1_000)
                                                .reduce(
                                                    (prev, curr) =>
                                                        prev +
                                                        curr.floorprice *
                                                            (curr.balance || 1),
                                                    0
                                                )
                                                .toFixed(2)}{" "}
                                            ETH) */}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="w-64 py-3 px-4 flex flex-col space-y-1">
                                <header className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        Twitter
                                    </span>
                                    {holder.twitter?.screen_name && (
                                        <a
                                            href={`https://twitter.com/${holder.twitter.screen_name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-light text-gray-400 hover:underline"
                                        >
                                            {holder.twitter.name}
                                        </a>
                                    )}
                                </header>
                                <div className="px-2 py-1">
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <span>Followers</span>
                                        <span className="justify-self-end">
                                            {holder.twitter?.followers || "–"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <span>Followings</span>
                                        <span className="justify-self-end">
                                            {holder.twitter?.followings || "–"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <span>Likes</span>
                                        <span className="justify-self-end">
                                            {holder.twitter?.likes || "–"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-64 py-3 px-4 flex flex-col space-y-1">
                                <header className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        Discord
                                    </span>
                                    {holder.discord?.username && (
                                        <span className="text-xs font-light text-gray-400">
                                            {holder.discord?.username}
                                        </span>
                                    )}
                                </header>
                                <div className="px-2 py-1">
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <span>Joined</span>
                                        <span className="justify-self-end">
                                            {holder.discord?.joinedAt
                                                ? new Date(
                                                      holder.discord?.joinedAt
                                                  )
                                                      .toDateString()
                                                      .slice(4)
                                                : "–"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            ) : null}
        </>
    );
};
