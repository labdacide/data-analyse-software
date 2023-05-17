import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspace = await db.workspace.findUnique({
        where: { name: req.session.user?.workspace },
    });
    const token = jwt.sign({ id: workspace?.id }, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
    });
    const invite = `${process.env.NEXT_PUBLIC_URI}/signup?invite=${token}`;
    return res.send(invite);
}

export default withApiAuth(handler);
