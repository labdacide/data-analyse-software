import React, { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";
import * as Icon from "react-feather";
import { useQuery, useMutation } from "@tanstack/react-query";
import { withPublicAuth } from "@/utils/auth";
import { Layout } from "@/components/layout";
import { Dropdown, Skeleton } from "@/components/ui";
import { CSVLink } from "react-csv";
import { MemberList } from "@/components/community/members-list";

interface Condition {
    id: string;
    name: string;
    operator: "$eq" | "$lt" | "$gt" | "$in" | "$exists";
    value: string | string[] | number;
}

interface Sort {
    field: string;
    order: 1 | -1;
}

const COLUMNS = [
    { name: "Net worth", type: "number", path: "netWorth.usd" },
    { name: "Balance", type: "number", path: "balance.usd" },
    { name: "Collection", type: "string", path: "collection" },
    { name: "Followers", type: "number", path: "twitter.followers" },
    { name: "Followings", type: "number", path: "twitter.followings" },
    { name: "Likes", type: "number", path: "twitter.likes" },
    { name: "Country", type: "string", path: "country" },
    { name: "Holder", type: "boolean", path: "holds.0" },
    { name: "Discord", type: "boolean", path: "discord" },
    { name: "Twitter", type: "boolean", path: "twitter" },
];

const useMembers = (
    filter: Condition[],
    page: number,
    q?: string,
    sort?: Sort
) =>
    useQuery(
        ["members", { filter, page, q, sort }],
        () => {
            let params: any = { page };
            if (q) params.q = q;
            const searchParams = new URLSearchParams(params).toString();
            return fetch(`/api/members?` + searchParams, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({ filter, sort }),
            }).then((r) => r.json());
        },
        { refetchOnWindowFocus: false }
    );

const useLeaderboard = () =>
    useQuery(["leaderboard"], () =>
        fetch("/api/members/leaderboard").then((r) => r.json())
    );

const useCollections = () =>
    useQuery(["collections"], () =>
        fetch("/api/members/collections").then((r) => r.json())
    );

const useTags = () =>
    useQuery(["tags"], () => fetch("/api/tags").then((r) => r.json()));

const useColumns = () => COLUMNS;

interface TagDropdownMenuProps {
    onSelect: (tag: any) => void;
}

const TagDropdownMenu = ({ onSelect }: TagDropdownMenuProps) => {
    const [open, toggle] = useState(false);
    const tags = useTags();
    if (tags.isLoading) {
        return <Skeleton className="h-4 w-8" />;
    }
    if (tags.data) {
        return (
            <div className="relative">
                <button
                    onClick={() => toggle((prev) => !prev)}
                    className="bg-white border rounded-md text-xs py-1.5 px-2 flex items-center space-x-1"
                >
                    <div className="text-gray-600">
                        <Icon.Tag size={14} />
                    </div>
                    <span>Tags</span>
                </button>
                <Dropdown visible={open} close={() => toggle(false)}>
                    <ul className="py-1 text-xs text-gray-600 divide-y divide-gray-100">
                        {tags.data.map((tag: any) => (
                            <li key={tag.id}>
                                <button
                                    onClick={() => {
                                        onSelect(tag);
                                        toggle(false);
                                    }}
                                    className="w-full py-1.5 px-3 text-left bg-white hover:bg-gray-50"
                                >
                                    {tag.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Dropdown>
            </div>
        );
    }
    return null;
};

interface FilterDropdownMenuProps {
    onSelect: (field: {
        id: string;
        name: string;
        path: string;
        type: string;
    }) => void;
}

const FilterDropdownMenu = ({ onSelect }: FilterDropdownMenuProps) => {
    const [open, toggle] = useState(false);
    const columns = useColumns();
    return (
        <div className="relative">
            <button
                onClick={() => toggle(!open)}
                className="bg-white border rounded-md text-xs py-1.5 px-2 flex items-center space-x-1"
            >
                <div className="text-gray-600">
                    <Icon.Filter size={14} />
                </div>
                <span>Filter</span>
            </button>
            <Dropdown visible={open} close={() => toggle(false)}>
                <ul className="py-1 text-xs text-gray-600 divide-y divide-gray-100">
                    {columns.map((col) => {
                        const id = nanoid();
                        return (
                            <li key={id}>
                                <button
                                    onClick={() => {
                                        onSelect({ ...col, id });
                                        toggle(false);
                                    }}
                                    className="w-full text-left py-1.5 px-3 bg-white hover:bg-gray-50"
                                >
                                    {col.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Dropdown>
        </div>
    );
};

interface FieldDropdownProps {
    id: string;
    name: string;
    type: number | string;
    path: string;
    values: string[];
    defaultValue?: string;
    upsertCondition: (c: Condition) => void;
    removeCondition: (id: string) => void;
    removeField: (id: string) => void;
}

function FieldDropdown({
    id,
    name,
    type,
    path,
    values,
    defaultValue,
    upsertCondition,
    removeCondition,
    removeField,
}: FieldDropdownProps) {
    const [open, toggle] = useState(false);
    const [operator, setOperator] = useState<Condition["operator"]>("$eq");
    const [value, setValue] = useState(defaultValue || "");
    const [matchingValues, setMatchingValues] = useState(values.slice(0, 5));

    function handleValueChange(e: any) {
        // Update value
        setValue(e.target.value);
        // Update matching values
        if (e.target.value === "") {
            removeCondition(id);
            setMatchingValues(values.slice(0, 5));
        } else {
            setMatchingValues(
                values.filter((v) => v.includes(e.target.value)).slice(0, 5)
            );
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        validate();
    }

    function validate() {
        upsertCondition({
            id,
            name: path,
            operator,
            value:
                type === "number" && typeof value === "string"
                    ? parseFloat(value)
                    : value,
        });
        toggle(false);
    }

    return (
        <div className="relative">
            <button
                onClick={() => toggle(!open)}
                className={classNames(
                    "group bg-white border rounded-md text-xs py-1.5 px-2 flex items-center space-x-1 text-gray-800 max-w-xs",
                    {
                        "border-black": value !== "",
                    }
                )}
            >
                <div className="text-gray-600">
                    {type === "number" ? (
                        <Icon.Hash size={12} />
                    ) : (
                        <Icon.List size={12} />
                    )}
                </div>
                <span className="truncate">
                    {name}
                    {value && ": " + value}
                </span>

                <button
                    className="invisible group-hover:visible text-gray-600"
                    onClick={(e) => {
                        if (value !== "") {
                            setValue("");
                            removeCondition(id);
                        } else removeField(id);
                        e.stopPropagation();
                    }}
                >
                    <Icon.X size={12} />
                </button>
            </button>
            <Dropdown visible={open} close={() => toggle(false)}>
                <ul className="py-1 text-xs text-gray-600 divide-y divide-gray-100">
                    <li
                        key={-1}
                        className={classNames("px-1", {
                            "pb-1": matchingValues.length > 0,
                        })}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="border bg-gray-50 rounded overflow-hidden divide flex items-center"
                        >
                            {type === "number" && (
                                <div className="p-1 bg-white">
                                    <select
                                        name="operator"
                                        id="operator"
                                        className="focus:outline-none"
                                        onChange={(e) =>
                                            setOperator(
                                                e.target
                                                    .value as Condition["operator"]
                                            )
                                        }
                                    >
                                        <option value="$eq">{"="}</option>
                                        <option value="$gt">{">"}</option>
                                        <option value="$lt">{"<"}</option>
                                    </select>
                                </div>
                            )}
                            <input
                                id="value"
                                type="search"
                                name="value"
                                placeholder="Type a value"
                                autoComplete="off"
                                value={value}
                                onChange={handleValueChange}
                                className="p-1 w-full focus:outline-none"
                            />
                        </form>
                    </li>

                    {matchingValues.map((v, index) => (
                        <li key={index}>
                            <button
                                onClick={() => {
                                    setValue(v);
                                    upsertCondition({
                                        id,
                                        name: path,
                                        operator,
                                        value: v,
                                    });
                                    toggle(false);
                                }}
                                className="w-full text-left py-1.5 pl-2 pr-6 bg-white hover:bg-gray-50"
                            >
                                {v}
                            </button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    );
}

interface BooleanFieldProps {
    id: string;
    name: string;
    removeField: (id: string) => void;
}

function BooleanField({ id, name, removeField }: BooleanFieldProps) {
    return (
        <div
            className={classNames(
                "group bg-white border rounded-md text-xs py-1.5 px-2 flex items-center space-x-1 text-gray-800 max-w-xs",
                "border-black"
            )}
        >
            <div className="text-gray-600">
                <Icon.ToggleRight size={12} />
            </div>
            <span className="truncate">{name}</span>

            <button
                className="invisible group-hover:visible text-gray-600"
                onClick={() => {
                    removeField(id);
                }}
            >
                <Icon.X size={12} />
            </button>
        </div>
    );
}

interface CreateTagButtonProps {
    createTag: (name: string) => void;
    visible?: boolean;
}

const CreateTagButton = ({ visible, createTag }: CreateTagButtonProps) => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    if (!visible) return null;

    function handleCreateTag(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsInputVisible(false);
        const target = e.target as typeof e.target & {
            name: { value: string };
        };
        createTag(target.name.value);
    }

    if (isInputVisible) {
        return (
            <form
                onSubmit={handleCreateTag}
                className="bg-white flex items-center space-x-2 rounded-md border p-1 overflow-hidden"
            >
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tag name"
                    className="w-full p-1 text-xs text-gray-600 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-indigo-500 text-white p-1.5 rounded"
                >
                    <Icon.Plus size={14} strokeWidth={2} />
                </button>
            </form>
        );
    }
    return (
        <button
            onClick={() => setIsInputVisible(true)}
            className="bg-indigo-500 text-white text-xs border border-indigo-500 hover:border-indigo-200 rounded-md px-2 py-1.5"
        >
            Create tag
        </button>
    );
};

const MoreMenu = ({ members }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 rounded cursor-pointer bg-transparent hover:bg-gray-200"
            >
                <Icon.MoreVertical size={14} />
            </div>
            <Dropdown
                className=""
                close={() => setIsOpen(false)}
                visible={isOpen}
            >
                {members && members.length > 0 && (
                    <CSVLink
                        filename="members.csv"
                        data={members.map((m: any) => ({
                            address: m.address,
                            twitter: m.twitterUsername || m.twitterName || "",
                            discord: m.discordUsername || m.discordName || "",
                            networth: m.netWorth,
                        }))}
                        className="w-full text-left py-1.5 px-3 bg-white hover:bg-gray-50 text-xs text-gray-600"
                    >
                        Export as CSV
                    </CSVLink>
                )}
            </Dropdown>
        </div>
    );
};

interface LeaderboardCardProps {
    holder: any;
    name: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
    children: ReactNode;
}
const LeaderboardCard = ({
    holder,
    name,
    textColor,
    bgColor,
    borderColor,
    children,
}: LeaderboardCardProps) => {
    return (
        <div className="h-full relative bg-white border rounded-md">
            <div
                className={classNames(
                    "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 rounded w-fit border",
                    borderColor,
                    bgColor,
                    textColor
                )}
            >
                <span className="text-xs whitespace-nowrap">{name}</span>
            </div>
            <div className="p-4 pt-6">
                <div className="text-xs truncate text-gray-600">
                    {holder.address} ↗
                </div>
                <div className="mt-2 flex items-start space-x-10 justify-center">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-600">Networth</span>
                        <span className="text-xl">
                            ${holder.netWorth?.usd?.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-600">Balance</span>
                        <span className="text-xl">
                            ${holder.balance?.usd?.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="border-t p-2">{children}</div>
        </div>
    );
};

const Leaderboard = () => {
    const leaderboard = useLeaderboard();

    const twitterProfile = useQuery(
        ["twitterProfile", { leaderboard }],
        () =>
            fetch(
                `/api/members/twitter/${leaderboard.data["influencer"].twitter?.screen_name}`
            ).then((r) => r.json()),
        { refetchOnWindowFocus: false }
    );

    function kFormatter(num: number) {
        return Math.abs(num) > 999
            ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + "K"
            : Math.sign(num) * Math.abs(num);
    }

    return (
        <div className="max-w-5xl mx-auto mb-2">
            {!leaderboard.isLoading && leaderboard.data && (
                <ul className="grid grid-cols-3 gap-x-4">
                    <li key={"networth"}>
                        <LeaderboardCard
                            name="The Collector"
                            textColor="text-yellow-600"
                            bgColor="bg-yellow-100"
                            borderColor="border-yellow-300"
                            holder={leaderboard.data["networth"]}
                        >
                            <div className="flex flex-col space-y-2">
                                {leaderboard.data["networth"].collection
                                    .filter((nft: any) => nft.thumbnail)
                                    .sort(
                                        (a: any, b: any) =>
                                            b.floorprice - a.floorprice
                                    )
                                    .slice(0, 3)
                                    .map((nft: any) => (
                                        <div
                                            key={nft.address}
                                            className="flex space-x-3"
                                        >
                                            <div>
                                                <img
                                                    src={nft.thumbnail}
                                                    className="h-12 rounded"
                                                />
                                            </div>
                                            <div className="truncate">
                                                <span className="text-xs">
                                                    {nft.name || nft.symbol}
                                                </span>
                                                <div className="flex items-start">
                                                    <span className="text-sm mr-0.5">
                                                        {nft.floorprice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                    <small className="text-sm font-light text-gray-400">
                                                        {nft.currency}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </LeaderboardCard>
                    </li>
                    <li key={"balance"}>
                        <LeaderboardCard
                            name="The Big Money"
                            textColor="text-green-600"
                            bgColor="bg-green-100"
                            borderColor="border-green-300"
                            holder={leaderboard.data["balance"]}
                        >
                            <div>
                                <img src="https://camo.githubusercontent.com/ac612bb4a9d2c847b1482806bd3a091e024db2ca95823d26023a336e6707305e/687474703a2f2f6469766572732e636f72656e74696e2d74686f6d61737365742e66722f7075626c69632f696d616765732f6461792d686561746d61702d312e504e47" />
                            </div>
                        </LeaderboardCard>
                    </li>
                    {leaderboard.data["influencer"].twitter ? (
                        <li key={"influencer"}>
                            <LeaderboardCard
                                name="The Influencer"
                                textColor="text-blue-600"
                                bgColor="bg-blue-100"
                                borderColor="border-blue-300"
                                holder={leaderboard.data["influencer"]}
                            >
                                <div className="p-2 flex flex-col space-y-4">
                                    <div className="flex space-x-4">
                                        <div>
                                            <img
                                                src={
                                                    twitterProfile.data
                                                        ?.profile_image_url
                                                }
                                                className="w-12 h-12 rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-sm">
                                                {twitterProfile.data?.name}
                                            </span>
                                            <small className="text-gray-400 text-xs">
                                                @
                                                {
                                                    twitterProfile.data
                                                        ?.screen_name
                                                }
                                            </small>
                                        </div>
                                        {twitterProfile.data && (
                                            <div>
                                                <a
                                                    href={`https://twitter.com/${leaderboard.data["influencer"].twitter.screen_name}`}
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
                                    <div>
                                        <p className="text-sm mb-2">
                                            {twitterProfile.data?.description}
                                        </p>
                                        <div className="text-sm flex space-x-4">
                                            <span className="text-base">
                                                {kFormatter(
                                                    leaderboard.data[
                                                        "influencer"
                                                    ].twitter.followings
                                                )}{" "}
                                                <small className="text-gray-400">
                                                    Following
                                                </small>
                                            </span>
                                            <span className="text-base">
                                                {kFormatter(
                                                    leaderboard.data[
                                                        "influencer"
                                                    ].twitter.followers
                                                )}{" "}
                                                <small className="text-gray-400">
                                                    Followers
                                                </small>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </LeaderboardCard>
                        </li>
                    ) : null}
                </ul>
            )}
        </div>
    );
};

export default function CommunityPage({ user }: any) {
    const [filter, setFilter] = useState<Condition[]>([]);
    const [tagId, setTagId] = useState<number>();
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<Sort>();
    const [filterFields, setFilterFields] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const members = useMembers(filter, page, searchQuery, sort);
    const tags = useTags();
    const collections = useCollections();
    const columns = useColumns();
    const contracts = useQuery(["contracts"], () =>
        fetch("/api/contracts").then((r) => r.json())
    );
    useEffect(() => setPage(0), [filter]);

    const { mutate: createTag } = useMutation(
        ({ name, filter }: any) =>
            fetch("/api/tags", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name,
                    filter,
                    ids: members.data.map(({ id }: any) => id),
                }),
            }),
        {
            onSuccess: () => tags.refetch(),
        }
    );

    function removeCondition(id: string) {
        setFilter((prev) => prev.filter((condition) => condition.id !== id));
    }

    function removeField(id: string) {
        setFilterFields(
            filterFields.filter((otherField) => otherField.id !== id)
        );
        removeCondition(id);
    }

    const upsertCondition = (condition: Condition) => {
        setFilter((prev) => [
            ...prev.filter(
                (otherCondition) => otherCondition.id !== condition.id
            ),
            condition,
        ]);
        setTagId(undefined);
    };

    return (
        <Layout
            title=""
            workspace={user.workspace}
            demo={user.demo}
            tab="Community"
        >
            <div className="w-full flex items-stretch">
                <div className="flex-1 p-8">
                    <Leaderboard />

                    <div className="max-w-5xl mx-auto flex items-center space-x-2 mb-2 text-gray-800">
                        <TagDropdownMenu
                            onSelect={(tag) => {
                                const tagFilter = tag.filter as Condition[];
                                tagFilter.forEach((condition) => {
                                    const id = nanoid();
                                    const col = columns.find(
                                        (col) => col.path === condition.name
                                    );
                                    if (!col) return;
                                    setFilter((prev) => [
                                        ...prev,
                                        { ...condition, id },
                                    ]);
                                    setFilterFields((prev) => [
                                        ...prev,
                                        { ...col, id },
                                    ]);
                                });
                                setTagId(tag.id);
                            }}
                        />

                        <FilterDropdownMenu
                            onSelect={(field) => {
                                setFilterFields((prev) => [...prev, field]);
                                if (field.type === "boolean") {
                                    upsertCondition({
                                        id: field.id,
                                        name: field.path,
                                        operator: "$exists",
                                        value: 1,
                                    });
                                }
                            }}
                        />

                        {filterFields.map((field, index) =>
                            field.type === "boolean" ? (
                                <BooleanField
                                    key={field.id}
                                    {...field}
                                    removeField={removeField}
                                />
                            ) : (
                                <FieldDropdown
                                    key={field}
                                    id={field.id}
                                    name={field.name}
                                    type={field.type}
                                    path={field.path}
                                    values={
                                        field.name === "Collection" &&
                                        collections.data
                                            ? collections.data
                                            : []
                                    }
                                    defaultValue={filter
                                        .find(
                                            (condition) =>
                                                condition.id === field.id
                                        )
                                        ?.value.toString()}
                                    upsertCondition={upsertCondition}
                                    removeCondition={removeCondition}
                                    removeField={removeField}
                                />
                            )
                        )}
                        {filter.length > 0 && (
                            <>
                                <CreateTagButton
                                    createTag={(name) =>
                                        createTag({ filter, name })
                                    }
                                    visible={
                                        filter.length > 0 && tagId === undefined
                                    }
                                />
                                <button
                                    onClick={() => {
                                        setFilter([]);
                                        setFilterFields([]);
                                    }}
                                    className="text-xs text-gray-400 px-2 py-1.5 rounded-md border border-gray-50 hover:text-gray-600 hover:border-gray-200 transition-colors"
                                >
                                    Reset filter
                                </button>
                            </>
                        )}

                        <div className="flex-1">
                            <div className="ml-auto w-max hover:w-full max-w-xs text-xs flex items-center border rounded-md overflow-hidden">
                                <div className="bg-white p-2 text-gray-600">
                                    <Icon.Search size={14} />
                                </div>
                                <input
                                    className="w-full bg-white py-1.5 pr-2 focus:outline-none text-gray-800"
                                    placeholder="search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.currentTarget.value)
                                    }
                                    onSubmit={() => members.refetch()}
                                    type="search"
                                    name="search"
                                    id="search"
                                />
                            </div>
                        </div>

                        <MoreMenu members={members.data} />
                    </div>

                    <MemberList
                        loading={members.isLoading}
                        // contracts={[
                        //     "0x97b4354dd212adaa6ccc08a4a0e7b2a30e76f1f8",
                        //     "0x5a9eb86269741a653c384d4810dbf093c86c44b8",
                        //     "0xba081def4abb725171d9c5e91ec19ae3e041e5d7",
                        //     "0x07314007735faf41fa8ed4f590e5165bd21604b1",
                        // ]}
                        contracts={contracts.data}
                        members={members.data || []}
                    />

                    {!members.isLoading && (
                        <div className="max-w-5xl mx-auto pt-2">
                            <div className="w-fit ml-auto flex bg-white border rounded-lg overflow-hidden divide-x text-gray-500 text-sm">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.min(p - 1, 0))
                                    }
                                    disabled={page === 0}
                                    className="py-1 pl-2 pr-4 flex items-center space-x-1 disabled:bg-gray-50 disabled:text-gray-300"
                                >
                                    <Icon.ChevronLeft size={14} />
                                    <span>prev</span>
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={members.data?.length < 15}
                                    className="py-1 pl-4 pr-2 flex items-center space-x-1 disabled:bg-gray-50 disabled:text-gray-300"
                                >
                                    <span>next</span>{" "}
                                    <Icon.ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps = withPublicAuth();
