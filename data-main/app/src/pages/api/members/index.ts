import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";

type Operator = "$in" | "$gt" | "$lt" | "$eq";

interface Condition {
    name: string;
    operator: Operator;
    value: string | string[] | number;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspaceName = req.session.user?.workspace;
    const isDemo = req.session.user?.demo;

    if (req.method === "POST") {
        const { filter, sort } = req.body as {
            filter: Condition[];
            sort: { field: string; order: -1 | 1 };
            q?: string;
        };
        const { q, page } = req.query;
        const workspace = await db.workspace.findUnique({
            where: { name: workspaceName },
            select: { id: true },
        });
        let conditions: any = { $and: [{ workspaceId: workspace?.id }] };
        if (filter && filter.length > 0) {
            filter.forEach((condition) => {
                if (condition.name === "collection") {
                    conditions.$and.push({
                        $or: [
                            { "collection.name": condition.value },
                            { "collection.address": condition.value },
                            { "collection.symbol": condition.value },
                        ],
                    });
                } else {
                    conditions.$and.push({
                        [condition.name]: {
                            [condition.operator]: condition.value,
                        },
                    });
                }
            });
        }
        if (q) {
            conditions.$and.push({
                $or: [
                    { "collection.name": { $regex: q, $options: "i" } },
                    { "collection.address": { $regex: q, $options: "i" } },
                    { "collection.symbol": { $regex: q, $options: "i" } },
                    { name: { $regex: q, $options: "i" } },
                    { address: { $regex: q, $options: "i" } },
                    { twitterUsername: { $regex: q, $options: "i" } },
                    { twitterName: { $regex: q, $options: "i" } },
                    { discordName: { $regex: q, $options: "i" } },
                ],
            });
        }

        const response = await fetch(
            `${process.env.BACKEND_URI}/members?page=${page}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({ conditions, sort }),
            }
        );
        let members = await response.json();

        if (isDemo) {
            members = members.map((member: any) => ({
                ...member,
                address: member.address.slice(0, 10) + "*****",
                name: "***",
                twitterName: "***",
                twitterUsername: "***",
                discordName: "***",
            }));
        }

        return res.json(members);
    }
}

export default withApiAuth(handler);
