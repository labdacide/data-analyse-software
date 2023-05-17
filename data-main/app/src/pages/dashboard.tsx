import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Chart from "@/components/chart";
import { withPublicAuth } from "@/utils/auth";
import { Layout } from "@/components/layout";
import * as Icon from "react-feather";
import { Skeleton, Tooltip, Dropdown, ProgressBar } from "@/components/ui";
import { todayMinusDays } from "@/utils";

export default function DashboardPage({ user }: any) {
    const [range, setRange] = useState<7 | 30 | 90 | 1000>(7);
    const [tagId, setTagId] = useState<number>();
    const [selectedContractId, setSelectedContractId] = useState(0);

    const contracts = useQuery(
        ["contracts"],
        () => fetch("/api/contracts/").then((r) => r.json()),
        {
            onSuccess: (data) => {
                console.log({ data, id: data[0].id });
                setSelectedContractId(data[0].id);
            },
            refetchOnWindowFocus: false,
        }
    );
    const tags = useQuery(
        ["tags"],
        () => fetch("/api/tags").then((r) => r.json()),
        { refetchOnWindowFocus: false }
    );

    const { mutate: createContract } = useMutation(
        (value) =>
            fetch("/api/contracts/", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    address: value,
                }),
            }),
        {
            onSuccess: () => {
                contracts.refetch();
            },
        }
    );

    const analytics = useQuery(
        ["events", { contracts, selectedContractId, tagId }],
        () =>
            fetch("/api/events/transactions", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    tagId,
                    contract: contracts.data.find(
                        (contract: any) => contract.id == selectedContractId
                    )?.address,
                }),
            }).then((r) => r.json()),
        { refetchOnWindowFocus: false }
    );

    const twitterAnalytics = useQuery(
        ["events", { tagId }],
        () =>
            fetch("/api/events/twitter", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ tagId }),
            }).then((r) => r.json()),
        { refetchOnWindowFocus: false }
    );

    const [open, toggle] = useState(false);

    return (
        <Layout
            title="Dashboard | Me3x"
            workspace={user.workspace}
            demo={user.demo}
            tab="Dashboard"
        >
            <div className="w-full flex flex-col space-y-8 max-w-5xl mx-auto p-8">
                <OverviewSection
                    loading={analytics.isLoading}
                    data={analytics.data?.overview}
                />
                <section
                    id="context"
                    className="flex items-center justify-between"
                >
                    <ContractList
                        loading={contracts.isLoading || !contracts.data}
                        contracts={contracts.data}
                        createContract={createContract}
                        onClick={(id) => {
                            setSelectedContractId(id);
                            console.log({ id });
                        }}
                        selectedContractId={selectedContractId}
                        blur={user.demo}
                    />

                    <div id="tags" className="ml-auto mr-2 flex space-x-1">
                        {!tags.isLoading && tags.data && (
                            <div className="relative">
                                <button
                                    onClick={() => toggle((prev) => !prev)}
                                    className={classNames(
                                        "group bg-white border rounded-md text-xs py-1 p-2 flex items-center space-x-1",
                                        { "border-black": tagId !== undefined }
                                    )}
                                >
                                    <div className="text-gray-600">
                                        <Icon.Tag size={14} />
                                    </div>
                                    <span className="text-gray-800">
                                        Tag
                                        {tagId &&
                                            ": " +
                                                tags.data.filter(
                                                    (t: any) => t.id === tagId
                                                )[0]?.name}
                                    </span>
                                    {tagId !== undefined && (
                                        <button
                                            className="invisible group-hover:visible text-gray-600"
                                            onClick={(e) => {
                                                setTagId(undefined);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Icon.X size={12} />
                                        </button>
                                    )}
                                </button>
                                <Dropdown
                                    visible={open}
                                    close={() => toggle(false)}
                                >
                                    <ul className="py-1 text-xs text-gray-600 divide-y divide-gray-100">
                                        {tags.data.map((tag: any) => (
                                            <li
                                                key={tag.id}
                                                onClick={() => {
                                                    setTagId(tag.id);
                                                    toggle(false);
                                                }}
                                                className="py-1 pl-2 pr-4 bg-white hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <button className="w-full py-0.5 pl-2 pr-4 text-left">
                                                    {tag.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Dropdown>
                            </div>
                        )}
                    </div>

                    <div className="border flex divide-x rounded-md bg-white overflow-hidden text-xs text-gray-600">
                        <button
                            onClick={() => setRange(7)}
                            className={`py-1 px-4 ${
                                range === 7 ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            7d
                        </button>
                        <button
                            onClick={() => setRange(30)}
                            className={`py-1 px-4 ${
                                range === 30 ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            30d
                        </button>
                        <button
                            onClick={() => setRange(90)}
                            className={`py-1 px-4 ${
                                range === 90 ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            90d
                        </button>
                        <button
                            onClick={() => setRange(1000)}
                            className={`py-1 px-4 ${
                                range === 1000 ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            All
                        </button>
                    </div>
                </section>

                <section
                    id="grid"
                    className="grid grid-cols-2 gap-4 items-start mt-8"
                >
                    {analytics.isLoading ||
                    contracts.isLoading ||
                    twitterAnalytics.isLoading ? (
                        <>
                            <div className="border rounded-lg bg-white">
                                <header className="py-2 px-3 flex items-center justify-between border-b">
                                    <Skeleton
                                        className={["h-3 w-32", "h-2 w-12 m-0"]}
                                    />
                                </header>
                                <div className="flex items-center justify-center p-6">
                                    <Skeleton className="w-full h-48" />
                                </div>
                            </div>
                            <div className="border rounded-lg bg-white">
                                <header className="py-2 px-3 flex items-center justify-between border-b">
                                    <Skeleton
                                        className={["h-3 w-32", "h-2 w-12 m-0"]}
                                    />
                                </header>
                                <div className="flex items-center justify-center p-6">
                                    <Skeleton className="w-full h-48" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {analytics.data &&
                                analytics.data.history.map((metric: any) => (
                                    <ChartCard
                                        key={metric.name}
                                        name={metric.name}
                                        views={metric.views}
                                        description={metric.description}
                                        data={{ ...metric }}
                                        dataKey={analytics.data.contract}
                                        start={todayMinusDays(range)
                                            .toJSON()
                                            .slice(0, 10)}
                                        end={new Date().toJSON().slice(0, 10)}
                                    />
                                ))}
                            {twitterAnalytics.data && (
                                <ChartCard
                                    name={twitterAnalytics.data.name}
                                    views={twitterAnalytics.data.views}
                                    description={
                                        twitterAnalytics.data.description
                                    }
                                    data={{ ...twitterAnalytics.data }}
                                    dataKey={"value"}
                                    start={todayMinusDays(range)
                                        .toJSON()
                                        .slice(0, 10)}
                                    end={new Date().toJSON().slice(0, 10)}
                                    references={
                                        user.demo
                                            ? undefined
                                            : twitterAnalytics.data.tweets
                                    }
                                />
                            )}
                        </>
                    )}

                    <CommunityTable tagId={tagId} />
                </section>
            </div>
        </Layout>
    );
}

function OverviewSection({ loading, data }: any) {
    if (!loading && !data) return null;

    return (
        <section
            id="overview"
            className="bg-white divide-x flex border rounded-lg w-fit mx-auto"
        >
            {loading ? (
                <>
                    <div className="px-6 py-4 flex flex-col space-y-2">
                        <Skeleton
                            className={[
                                "h-3 w-16",
                                "h-6 w-16 mb-2",
                                "h-2 w-32",
                            ]}
                        />
                    </div>
                    <div className="px-6 py-4 flex flex-col space-y-2">
                        <Skeleton
                            className={[
                                "h-3 w-24",
                                "h-5 w-16 mb-2",
                                "h-2 w-16",
                            ]}
                        />
                    </div>
                </>
            ) : (
                data.map(({ name, value, growth }: any) => (
                    <div key={name} className="px-6 py-4">
                        <h4 className="text-sm mb-1 capitalize">{name}</h4>
                        <span className="text-xl">{Math.round(value)}</span>
                        <div
                            className={classNames(
                                "mt-1 flex items-center space-x-1",
                                growth < 0 ? "text-red-600" : "text-green-600"
                            )}
                        >
                            {growth < 0 ? (
                                <Icon.TrendingDown size={14} />
                            ) : (
                                <Icon.TrendingUp size={14} />
                            )}
                            <span className="text-xs">
                                {Math.round(growth)}%
                                <small className="ml-1 text-gray-400 uppercase">
                                    vs prev. 28 days
                                </small>
                            </span>
                        </div>
                    </div>
                ))
            )}
        </section>
    );
}

interface ContractListProps {
    loading: boolean;
    contracts: any[];
    blur: boolean;
    selectedContractId: number;
    createContract: (args: any) => void;
    onClick: (index: number) => void;
}

function ContractList({
    loading,
    contracts,
    blur,
    selectedContractId,
    createContract,
    onClick,
}: ContractListProps) {
    const [isAddingContract, setIsAddingContract] = useState(false);
    return (
        <div className="flex items-center space-x-1">
            {loading ? (
                <>
                    <Skeleton className={["h-5 w-32", "h-5 w-32", "h-5 w-5"]} />
                </>
            ) : (
                <>
                    {contracts.map((contract: any) => (
                        <button
                            key={contract.id}
                            title={contract.address}
                            onClick={() => onClick(contract.id)}
                            className={classNames(
                                "max-w-[120px] border-2 border-indigo-500 rounded py-1 px-3 text-xs truncate",
                                selectedContractId === contract.id
                                    ? "bg-gradient-to-b from-indigo-500 to-indigo-400 text-white"
                                    : "bg-transparent text-indigo-800 border-indigo-500"
                            )}
                        >
                            <div
                                className={classNames("w-full truncate", {
                                    "blur-xl": blur,
                                })}
                            >
                                {contract.name || contract.address}
                            </div>
                        </button>
                    ))}
                    {isAddingContract ? (
                        <form
                            onSubmit={(e: any) => {
                                e.preventDefault();
                                createContract(e.target["contract"].value);
                                setIsAddingContract(false);
                            }}
                        >
                            <input
                                type="text"
                                name="contract"
                                id="contract"
                                placeholder="Paste address here"
                                autoFocus
                                onBlur={() => setIsAddingContract(false)}
                                className="border-2 bg-white rounded py-1 px-2 text-xs text-gray-500 focus:outline-none"
                            />
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAddingContract(true)}
                            className="rounded w-7 h-7 bg-gradient-to-b from-indigo-500 to-indigo-400 border-2 border-indigo-500 text-white flex items-center justify-center"
                        >
                            <Icon.Plus size={14} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

const CommunityTable = ({ tagId }: { tagId?: number }) => {
    const [rows, setRows] = useState(5);

    const communityOverlap = useQuery(
        ["overlap", { tagId }],
        () =>
            fetch("/api/members/overlap", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ tagId }),
            }).then((r) => r.json()),
        { refetchOnWindowFocus: false, onSuccess: () => setRows(5) }
    );

    if (!communityOverlap.data) return null;
    return (
        <div className="self-stretch bg-white border rounded-lg flex flex-col">
            <header className="py-2 px-3 flex items-center justify-between text-gray-800 border-b">
                <div className="flex items-center space-x-2 text-gray-500">
                    <h4 className="text-sm capitalize">Community Overlap</h4>
                    <Tooltip text="Number of members in other communities" />
                </div>
            </header>
            <nav className="w-full bg-gray-50 border-b px-4 py-2 flex justify-between text-xs text-gray-400">
                <p>Community</p>
                <p>Members</p>
            </nav>
            <div className="flex-1 text-xs text-gray-600 p-4 grid items-start grid-cols-2 gap-x-6 gap-y-3 overflow-y-auto">
                {communityOverlap.data.communities
                    .slice(0, rows)
                    .map((community: any, index: number) => (
                        <React.Fragment key={index}>
                            <span className="truncate">{community.name}</span>
                            <div className="w-full flex items-center space-x-4">
                                <ProgressBar
                                    progress={
                                        (community.count * 100) /
                                        communityOverlap.data.max
                                    }
                                />
                                <div className="w-8">{community.count}</div>
                            </div>
                        </React.Fragment>
                    ))}
            </div>
            <div className="text-center text-xs text-gray-400 border-t">
                <button
                    onClick={() => setRows((r) => r + 5)}
                    className="w-full p-2"
                >
                    show more
                </button>
            </div>
        </div>
    );
};

interface ChartCardProps {
    name: string;
    description: string;
    views: string[];
    data: { [k: string]: { date: string; value: number }[] };
    dataKey: string;
    start: string;
    end: string;
    references?: { label: string; date: string }[];
}

const ChartCard = ({
    name,
    description,
    views,
    data,
    dataKey,
    start,
    end,
    references,
}: ChartCardProps) => {
    const [visibleView, setVisibleView] = useState(views[0]);
    return (
        <div className="border rounded-lg bg-white">
            <header className="py-2 px-3 flex items-center justify-between text-gray-800 border-b">
                <div className="flex items-center space-x-2 text-gray-500">
                    <h4 className="text-sm capitalize">{name}</h4>
                    <Tooltip text={description} />
                </div>
                <div className="flex items-center space-x-2">
                    {views &&
                        views.map((view, index) => (
                            <button
                                key={index}
                                onClick={() => setVisibleView(view)}
                                className={classNames(
                                    "text-xs",
                                    visibleView === view
                                        ? "text-gray-600"
                                        : "text-gray-200"
                                )}
                            >
                                {view}
                            </button>
                        ))}
                </div>
            </header>

            <Chart
                data={data[visibleView].filter(
                    (entry) => entry.date >= start && entry.date <= end
                )}
                dataKey={dataKey}
                references={references}
            />
        </div>
    );
};

export const getServerSideProps = withPublicAuth();
