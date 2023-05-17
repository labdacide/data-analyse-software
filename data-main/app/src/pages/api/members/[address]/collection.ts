import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/utils/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { address } = req.query;

        const response = await fetch(
            `${process.env.BACKEND_URI}/members/${address}/collection`
        );
        const data = await response.json();
        return res.json(data);
    }
}

export default withApiAuth(handler);
