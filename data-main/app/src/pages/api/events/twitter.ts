import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { tagId } = req.body;
    let filter: any;
    if (tagId) {
      const tag = await db.tag.findUnique({
        where: { id: parseInt(tagId) },
        select: { filter: true },
      });
      if (tag && tag.filter) {
        filter = tag.filter;
      }
    }
    const workspaceName = req.session.user?.workspace;
    const workspace = await db.workspace.findUnique({
      where: { name: workspaceName },
    });
    const response = await fetch(
      `${process.env.BACKEND_URI}/history/twitter/${workspace?.twitterUsername}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filter }),
      }
    );
    const data = await response.json();
    return res.json(data);
  }
}

export default withApiAuth(handler);
