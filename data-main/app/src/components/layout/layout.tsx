import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Bell } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";

interface LayoutProps {
    title?: string;
    tab: "Dashboard" | "Community" | "Campaigns";
    workspace: string;
    demo?: true;
    children: ReactNode;
}

const routes = [
    { id: 0, name: "Dashboard", path: "/dashboard" },
    { id: 1, name: "Community", path: "/community" },
    { id: 2, name: "Campaigns", path: "/campaigns" },
];

export default function Layout({
    title,
    tab,
    workspace,
    demo,
    children,
}: LayoutProps) {
    const workspaces = useQuery(["workspaces"], () =>
        fetch("/api/workspaces/").then((r) => r.json())
    );
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>{title || "Me3x"}</title>
            </Head>

            {demo && (
                <nav className="w-full bg-black p-2 text-center sticky top-0 z-50">
                    <span className="text-white text-sm font-light">
                        You are viewing a demo version of a real project
                        dashboard. All sensitive data are hidden for obvious
                        reasons.
                    </span>
                </nav>
            )}

            <header className="relative flex items-center justify-between px-8 py-4 border-b">
                <div className="flex items-center space-x-8">
                    <div className="text-sm font-medium text-gray-800">
                        me3x
                    </div>
                    <ul className="flex space-x-2 text-xs">
                        {routes.map((routes) => (
                            <li key={routes.id}>
                                <Link href={routes.path}>
                                    <a
                                        className={classNames(
                                            "p-2 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-800",
                                            {
                                                "bg-gray-200 text-gray-800":
                                                    routes.name === tab,
                                            }
                                        )}
                                    >
                                        {routes.name}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="bg-white py-1 px-2 rounded border flex items-center space-x-2">
                            <select
                                name="workspace"
                                id="workspace"
                                className="text-xs text-gray-600 select-none focus:outline-none"
                                onChange={async (e) => {
                                    await fetch("/api/workspaces/", {
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            workspace: e.target.value,
                                        }),
                                    });
                                    location.reload();
                                }}
                            >
                                <option value={demo ? "Demo" : workspace}>
                                    {demo ? "Demo" : workspace}
                                </option>
                                {!demo &&
                                    workspaces.data &&
                                    workspaces.data
                                        .filter(
                                            (space: any) =>
                                                space.name !== workspace
                                        )
                                        .map((space: any) => (
                                            <option
                                                key={space.id}
                                                value={space.name}
                                            >
                                                {space.name}
                                            </option>
                                        ))}
                            </select>
                        </div>
                        {!demo && (
                            <button
                                onClick={async () => {
                                    const inviteLink = await fetch(
                                        "/api/workspaces/invite"
                                    ).then((r) => r.text());
                                    navigator.clipboard.writeText(inviteLink);
                                    setCopiedToClipboard(true);
                                    setInterval(
                                        () => setCopiedToClipboard(false),
                                        4_000
                                    );
                                }}
                                className={classNames(
                                    "text-xs uppercase font-medium text-gray-400 px-4 py-1 rounded"
                                )}
                            >
                                {copiedToClipboard
                                    ? "Copied to clipboard"
                                    : "Invite"}
                            </button>
                        )}
                    </div>

                    <button className="text-gray-500">
                        <Bell size={16} />
                    </button>
                </div>
            </header>

            <div className="flex-1 relative flex">{children}</div>
        </main>
    );
}
