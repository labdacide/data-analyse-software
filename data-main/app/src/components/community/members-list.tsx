import React from "react";
import { Skeleton } from "@/components/ui";
import { MemberItem } from "./member-item";

const SkeletonItem: React.FC = () => (
    <div className="bg-white border rounded-xl flex flex-col px-6">
        <div className="border-b py-3">
            <div className="flex items-center space-x-2 text-xs pb-2">
                <Skeleton className="h-3 w-52" />
                <Skeleton className="h-3 w-16" />
            </div>
            <div className="pt-1 flex items-center space-x-6 text-gray-800">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
        <div className="pt-2 pb-6">
            <div className="flex items-center space-x-8 text-gray-600">
                <div className="flex-1 text-black flex items-center space-x-2">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-gray-400 flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    </div>
);

interface MemberListProps {
    members: any[];
    contracts: string[];
    loading: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({
    members,
    contracts,
    loading,
}) => {
    return (
        <div className="max-w-5xl mx-auto">
            <div>
                <div className="text-sm text-gray-600 flex flex-col space-y-2">
                    {loading ? (
                        <>
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                        </>
                    ) : members.length > 0 ? (
                        members.map((holder, index) => (
                            <MemberItem
                                key={index}
                                tag={"Tag"}
                                contracts={contracts}
                                {...holder}
                            />
                        ))
                    ) : (
                        <div>
                            <div>
                                <div className="py-2">
                                    <p className="text-center text-xs text-gray-400">
                                        No results found
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
