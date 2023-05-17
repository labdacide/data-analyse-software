import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const id = req.session.user?.id;
    if (!id) return res.status(404).end();

    const workspaces = await db.workspace.findMany({
      where: { contributors: { some: { userId: id } } },
    });
    return res.json(workspaces);
  }

  if (req.method === "POST") {
    const { workspace } = req.body;
    const user = req.session.user;
    if (!user) return res.status(404);
    req.session.user = {
      ...user,
      workspace,
    };
    await req.session.save();
    return res.end();
  }
}

export default withApiAuth(handler);
