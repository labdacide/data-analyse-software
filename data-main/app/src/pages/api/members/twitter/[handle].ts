import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { handle } = req.query;

        const response = await fetch(
            `${process.env.BACKEND_URI}/twitter/profile/${handle}`
        );
        const data = await response.json();
        return res.json(data);
    }
}

export default withApiAuth(handler);
