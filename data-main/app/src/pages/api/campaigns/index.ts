import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/db";
import { withApiAuth } from "@/utils/auth";
import { todayMinusDays } from "@/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspaceName = req.session.user?.workspace;

    if (req.method === "GET") {
        const { range, tagId } = req.query;

        const workspace = await db.workspace.findUnique({
            where: { name: workspaceName },
            select: {
                contracts: { select: { address: true } },
            },
        });
        const startDate =
            range && typeof range === "string"
                ? todayMinusDays(parseInt(range))
                : todayMinusDays(7);

        let conditions: { $and: { [k: string]: any }[] } = {
            $and: [
                { name: "Transaction" },
                { "properties.address": workspace?.contracts[0].address },
                { date: { $gt: startDate } },
            ],
        };
        let filter: any;
        if (tagId && typeof tagId === "string") {
            const tag = await db.tag.findUnique({
                where: { id: parseInt(tagId) },
                select: { filter: true },
            });
            if (tag && tag.filter) {
                filter = tag.filter;
            }
        }
        const response = await fetch(`${process.env.BACKEND_URI}/campaign`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                conditions,
                filter,
                start: startDate,
            }),
        });
        const steps = await response.json();
        return res.json({ steps });
    }
}

export default withApiAuth(handler);
