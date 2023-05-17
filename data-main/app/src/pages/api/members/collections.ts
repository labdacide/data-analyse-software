import { withApiAuth } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspaceName = req.session.user?.workspace;
    const workspace = await db.workspace.findUnique({
        where: { name: workspaceName },
    });
    const response = await fetch(
        `${process.env.BACKEND_URI}/${workspace?.id}/collections`
    );
    const data = await response.json();
    return res.json(data);
}

export default withApiAuth(handler);
