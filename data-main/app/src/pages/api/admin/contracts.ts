import { NextApiRequest, NextApiResponse } from "next";
import { withAdminAuth } from "@/utils/auth";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const allContracts = await db.contract.findMany({
            include: { workspaces: true },
        });
        return res.json(allContracts);
    }
}

export default withAdminAuth(handler);
