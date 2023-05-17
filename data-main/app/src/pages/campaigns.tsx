import { useState } from "react";
import classNames from "classnames";
import { ChevronDown, Tag as TagIcon, X as XIcon } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import { withPublicAuth } from "@/utils/auth";
import { Layout } from "@/components/layout";
import MembersTable from "@/components/members-table";
import { Skeleton, Dropdown } from "@/components/ui";

const useTags = () =>
    useQuery(["tags"], () => fetch("/api/tags").then((r) => r.json()), {
        refetchOnWindowFocus: false,
    });

interface TagDropdownProps {
    onSelect: (id?: number) => void;
}
const TagDropdown = ({ onSelect }: TagDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTag, setActiveTag] = useState<any>();
    const tags = useTags();

    function selectTag(tag?: any) {
        setActiveTag(tag);
        onSelect(tag?.id);
        setIsOpen(false);
    }

    return (
        <div id="tags" className="ml-auto mr-2 flex space-x-1">
            {!tags.isLoading && tags.data && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={classNames(
                            "group bg-white border rounded-md text-xs py-1 p-2 flex items-center space-x-1",
                            { "border-black": activeTag !== undefined }
                        )}
                    >
                        <div className="text-gray-600">
                            <TagIcon size={14} />
                        </div>
                        <span className="text-gray-800">
                            Tag
                            {activeTag && ": " + activeTag.name}
                        </span>
                        {activeTag && (
                            <button
                                className="invisible group-hover:visible text-gray-600"
                                onClick={(e) => {
                                    selectTag(undefined);
                                    e.stopPropagation();
                                }}
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    </button>
                    <Dropdown visible={isOpen} close={() => setIsOpen(false)}>
                        <ul className="py-1 text-xs text-gray-600 divide-y divide-gray-100">
                            {tags.data.map((tag: any) => (
                                <li
                                    key={tag.id}
                                    onClick={() => selectTag(tag)}
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
    );
};

export default function CampaignsPage({ user }: any) {
    const [selectedStep, setSelectedStep] = useState(0);
    const [range, setRange] = useState<7 | 30 | 90 | 1000>(7);
    const [tagId, setTagId] = useState<number>();

    const campaign = useQuery(["campaigns", { range, tagId }], () =>
        fetch(
            "/api/campaigns/?" +
                new URLSearchParams({
                    range: range.toString(),
                    tagId: tagId ? tagId.toString() : "",
                }).toString()
        ).then((r) => r.json())
    );

    return (
        <Layout
            title="Campaigns"
            workspace={user.workspace}
            demo={user.demo}
            tab="Campaigns"
        >
            <div className="w-full max-w-5xl mx-auto py-8 flex flex-col space-y-8">
                <section className="flex justify-between items-center">
                    <TagDropdown onSelect={(id) => setTagId(id)} />
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
                <section>
                    {campaign.isLoading ? (
                        <>
                            <div className="w-fit mx-auto mb-6 flex divide-x border rounded-lg bg-white">
                                <div className="flex flex-col items-center space-y-2 px-10 py-4">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col items-center space-y-2 px-10 py-4">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-6 w-6" />
                                </div>
                            </div>

                            <MembersTable
                                loading={true}
                                members={[]}
                                onColumnClick={() => {}}
                            />
                        </>
                    ) : (
                        campaign.data && (
                            <>
                                <Funnel
                                    steps={campaign.data.steps}
                                    selectedStep={selectedStep}
                                    setSelectedStep={setSelectedStep}
                                />
                                <MembersTable
                                    loading={
                                        campaign.isLoading || !campaign.data
                                    }
                                    members={
                                        campaign.data.steps[selectedStep]
                                            .members
                                    }
                                    onColumnClick={() => {}}
                                    blur={user.demo}
                                />
                            </>
                        )
                    )}
                </section>
            </div>
        </Layout>
    );
}

const CoreMetricCard = ({ name, value, growth }: any) => {
    return (
        <div className="px-10 py-4 flex flex-col space-y-2 items-center">
            <h4 className="text-sm text-gray-600">{name}</h4>
            <span className="text-xl text-gray-800">{value}</span>
            {/* <div
        className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded ${
          growth < 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
        }`}
      >
        {growth < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}

        <span>{growth.toFixed(1)}%</span>
      </div> */}
        </div>
    );
};

const Funnel = ({
    steps,
    selectedStep,
    setSelectedStep,
}: {
    selectedStep: number;
    setSelectedStep: any;
    steps: [
        { name: string; value: number },
        { name: string; value: number },
        { name: string; value: number }
    ];
}) => {
    const conversions = steps.reduce((cum, curr, index) => {
        if (index === steps.length - 1) return cum;
        if (steps[index].value === 0) return [...cum, 0];
        return [
            ...cum,
            Math.round((steps[index + 1].value * 100) / steps[index].value),
        ];
    }, [] as number[]);

    return (
        <section className="mb-6 bg-white divide-x flex border rounded-lg w-fit mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="relative">
                    <button onClick={() => setSelectedStep(index)}>
                        <CoreMetricCard {...step} />
                    </button>
                    {index < conversions.length && (
                        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10 bg-white border w-11 h-8 flex items-center justify-center rounded-lg">
                            <span className="text-xs text-gray-600">
                                {conversions[index] === 0
                                    ? "–"
                                    : `${conversions[index]}%`}
                            </span>
                        </div>
                    )}
                    {selectedStep === index ? (
                        <div className="absolute inset-x-0 flex justify-center text-gray-400">
                            <ChevronDown strokeWidth={1.5} />
                        </div>
                    ) : null}
                </div>
            ))}
        </section>
    );
};

export const getServerSideProps = withPublicAuth();
