import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/db";
import { withAdminAuth } from "@/utils/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const allWorkspaces = await db.workspace.findMany();
    return res.json(allWorkspaces);
  }
}

export default withAdminAuth(handler);
