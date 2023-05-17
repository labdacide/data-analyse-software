import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import * as Icon from "react-feather";

function kFormatter(num?: number, decimals: number = 0) {
    if (!num) return 0;
    return Math.abs(num) > 9999
        ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + "K"
        : num.toFixed(decimals);
}

const CollectionTab: React.FC<{
    collection: any[];
}> = ({ collection }) => {
    return (
        <div className="max-h-56 overflow-y-auto">
            <div className="flex -space-x-2">
                {collection
                    .filter((asset) => asset.thumbnail)
                    .slice(0, 6)
                    .map((asset) => (
                        <div key={asset.address}>
                            <img
                                src={asset.thumbnail}
                                title={asset.name}
                                className="w-12 h-12 bg-white rounded-lg border-4 border-white"
                            />
                        </div>
                    ))}
            </div>
            <div className="pt-4 text-xs text-gray-600 grid grid-cols-2 gap-2 max-w-xs">
                {collection
                    .filter((asset) => asset.name)
                    .sort((a, b) => b.floorprice - a.floorprice)
                    .map((asset) => (
                        <React.Fragment key={asset.address}>
                            <span className="truncate">
                                {asset.name}
                                <span className="ml-1 text-gray-400">
                                    x{asset.balance}
                                </span>
                            </span>
                            <div className="flex">
                                <span>{asset.floorprice.toFixed(2)}</span>
                                <span>{asset.currency}</span>
                            </div>
                        </React.Fragment>
                    ))}
            </div>
        </div>
    );
};

const TwitterTab: React.FC<{ screen_name: string }> = ({ screen_name }) => {
    const profile = useQuery(["twitter", { screen_name }], () =>
        fetch(`/api/members/twitter/${screen_name}`).then((r) => r.json())
    );

    if (profile.isLoading) {
        return <p>loading…</p>;
    }
    if (!profile.data) {
        return <p>Not found.</p>;
    }
    return (
        <div className="px-2 flex flex-col">
            <div className="flex space-x-4">
                <div>
                    <img
                        src={profile.data?.profile_image_url}
                        className="w-12 h-12 rounded-full"
                    />
                </div>
                <div className="flex-1 flex flex-col text-sm">
                    <span className="">{profile.data?.name}</span>
                    <small className="text-gray-400 text-xs">
                        @{profile.data?.screen_name}
                    </small>
                </div>
                {profile.data && (
                    <div>
                        <a
                            href={`https://twitter.com/${screen_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit ml-auto"
                        >
                            <div className="w-fit text-xs py-1 px-3 rounded-xl border">
                                see on Twitter
                            </div>
                        </a>
                    </div>
                )}
            </div>
            <div className="pt-2">
                <p className="text-sm mb-2">{profile.data?.description}</p>
                <div className="text-xs flex space-x-4">
                    <span className="text-sm">
                        {kFormatter(profile.data?.friends_count)}
                        <small className="text-gray-400 ml-1">Following</small>
                    </span>
                    <span className="text-sm">
                        {kFormatter(profile.data?.followers_count)}
                        <small className="text-gray-400 ml-1">Followers</small>
                    </span>
                </div>
            </div>
        </div>
    );
};

export const MemberItem: React.FC<
    { tag: string; contracts: string[] } & any
> = ({ tag, contracts, ...member }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "collection" | "activity" | "twitter"
    >("collection");
    const [collection, setCollection] = useState<any[]>();

    useEffect(() => {
        if (isOpen && !collection) {
            fetch(`/api/members/${member.address}/collection`)
                .then((r) => r.json())
                .then((data) => setCollection(data));
        }
    }, [isOpen, collection, member.address, contracts]);

    return (
        <div
            className={classNames(
                "bg-white border rounded-xl flex flex-col px-6 transition-all",
                isOpen ? "max-h-[400px]" : "max-h-32"
            )}
        >
            <div className="border-b pt-2 pb-2">
                <div className="flex items-center space-x-2 text-xs pb-2">
                    <span className="text-gray-400 text-xs">
                        #{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            href={`https://${
                                member.platform === "ETH"
                                    ? "etherscan.io"
                                    : "polygonscan.com"
                            }/address/${member.address}`}
                        >
                            {member.address}
                        </a>
                    </span>

                    <div className="flex-1 flex space-x-2">
                        {/* <div className="py-0.5 px-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-800">
                            <span>{tag}</span>
                        </div> */}
                    </div>
                    {member.holds?.length > 0 && (
                        <div className="text-yellow-600 flex items-center float-right">
                            <Icon.Award size={14} />
                            <span>Holder</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-6 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <Icon.CreditCard size={14} />
                        <span className="text-sm text-black">
                            {kFormatter(member.balance?.usd, 2)}
                            <small className="text-gray-400 text-xs ml-0.5">
                                USD
                            </small>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon.DollarSign size={14} />
                        <span className="text-sm text-black">
                            {kFormatter(member.netWorth?.usd, 2)}
                            <small className="text-gray-400 text-xs ml-0.5">
                                USD
                            </small>
                        </span>
                    </div>
                    {member.twitter && (
                        <div className="flex items-center space-x-2">
                            <Icon.Twitter size={14} />
                            <span className="text-sm text-black">
                                {kFormatter(member.twitter.followers)}{" "}
                                <small className="text-xs text-gray-400">
                                    Followers
                                </small>
                            </span>
                        </div>
                    )}
                    {member.twitter && member.twitter.location && (
                        <div className="flex items-center space-x-2">
                            <Icon.MapPin size={14} />
                            <span className="text-xs">
                                {/* {member.twitter.location?.split(",")[1].trim()} */}
                                {member.twitter.location}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-2">
                <div className="flex items-center space-x-8 text-gray-600">
                    <div className="flex-1 text-black flex items-center space-x-2">
                        <Icon.ShoppingCart size={14} />
                        <span className="text-sm">
                            <small className="text-xs text-gray-400 mr-1">
                                Holds
                            </small>
                            {member.holds?.reduce(
                                (prev: number, curr: any) =>
                                    prev + curr.balance,
                                0
                            ) || 0}
                            <small className="text-xs text-gray-400 ml-1">
                                of your NFTs
                            </small>
                        </span>
                    </div>
                    <div className="text-gray-400 flex items-center space-x-2">
                        <Icon.Clock size={14} />
                        <span className="font-light text-xs">
                            updated {new Date(member.updatedAt).toDateString()}
                        </span>
                    </div>
                </div>
                <div>
                    {isOpen && (
                        <div className="pt-4">
                            <nav className="flex space-x-2 border-b w-full">
                                <button
                                    onClick={() => setActiveTab("collection")}
                                    className={classNames(
                                        "text-xs text-gray-600 pb-2 px-2 border-b",
                                        activeTab === "collection"
                                            ? "border-black"
                                            : "border-white"
                                    )}
                                >
                                    Collection
                                </button>
                                <button
                                    onClick={() => setActiveTab("activity")}
                                    className={classNames(
                                        "text-xs text-gray-600 pb-2 px-2 border-b",
                                        activeTab === "activity"
                                            ? "border-black"
                                            : "border-white"
                                    )}
                                >
                                    Activity
                                </button>
                                {member.twitter && (
                                    <button
                                        onClick={() => setActiveTab("twitter")}
                                        className={classNames(
                                            "text-xs text-gray-600 pb-2 px-2 border-b",
                                            activeTab === "twitter"
                                                ? "border-black"
                                                : "border-white"
                                        )}
                                    >
                                        Twitter
                                    </button>
                                )}
                            </nav>
                            <div className="pt-2">
                                {activeTab === "collection" ? (
                                    <CollectionTab
                                        collection={collection || []}
                                    />
                                ) : activeTab ===
                                  "activity" ? null : activeTab ===
                                  "twitter" ? (
                                    <TwitterTab
                                        screen_name={member.twitter.screen_name}
                                    />
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full opacity-0 hover:opacity-60 py-2 flex items-center justify-center text-gray-400 transition-opacity"
                >
                    {isOpen ? (
                        <Icon.ChevronUp size={18} />
                    ) : (
                        <Icon.ChevronDown size={18} />
                    )}
                </button>
            </div>
        </div>
    );
};
