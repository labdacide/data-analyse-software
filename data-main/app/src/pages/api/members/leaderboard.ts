import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const workspace = await db.workspace.findUnique({
            where: { name: req.session.user?.workspace },
        });

        const response = await fetch(
            `${process.env.BACKEND_URI}/members/${workspace?.id}/leaderboard`
        );
        const data = await response.json();
        return res.json(data);
    }
}

export default withApiAuth(handler);
