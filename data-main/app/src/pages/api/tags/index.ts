import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/db";
import { withApiAuth } from "@/utils/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspaceName = req.session.user?.workspace;

    if (req.method === "POST") {
        if (req.session.user?.demo) return res.end(); // Don't allow demo users to create new tags

        const { name, filter } = req.body;
        await db.tag.create({
            data: {
                name,
                filter,
                workspace: { connect: { name: workspaceName } },
            },
        });
        return res.end();
    }

    if (req.method === "GET") {
        const tags = await db.tag.findMany({ where: { workspaceName } });
        return res.json(tags);
    }
}

export default withApiAuth(handler);
