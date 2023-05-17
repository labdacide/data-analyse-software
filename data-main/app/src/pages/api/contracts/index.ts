import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const workspaceName = req.session.user?.workspace;
    const isDemo = req.session.user?.demo;

    if (req.method === "GET") {
        let contracts = await db.contract.findMany({
            where: { workspaces: { some: { name: workspaceName } } },
        });
        return res.json(contracts);
    }

    if (req.method === "POST") {
        if (isDemo) return res.end();
        const { address } = req.body;
        const workspace = await db.workspace.findFirst({
            where: { name: workspaceName },
            select: { platform: true },
        });

        if (!workspace) return res.status(404).end();

        let metadata = {};

        if (workspace.platform in ["ETH", "POLYGON", "SOLANA"]) {
            const apiURL = `https://${workspace.platform.toLowerCase()}-mainnet.g.alchemy.com`;
            const apiKey =
                workspace.platform === "ETH"
                    ? process.env.ALCHEMY_API_KEY_ETH
                    : process.env.ALCHEMY_API_KEY_POLYGON;

            const response = await fetch(
                `${apiURL}/nft/v2/${apiKey}/getContractMetadata?contractAddress=${address}`
            );
            const data = await response.json();
            metadata = {
                name: data.contractMetadata.name,
                symbol: data.contractMetadata.symbol,
                category: data.contractMetadata.tokenType,
                thumbnail: data.contractMetadata.opensea?.imageUrl,
            };
        }
        if (workspace.platform === "TEZOS") {
            const response = await fetch(
                `https://api.tzkt.io/v1/contracts/${address}`
            );
            const data = await response.json();
            metadata = {
                name: data.alias,
                category: data.tzips[0],
            };
        }

        await db.contract.create({
            data: {
                ...metadata,
                address: address,
                platform: workspace.platform,
                workspaces: {
                    connect: { name: workspaceName },
                },
            },
        });
        return res.end();
    }
}

export default withApiAuth(handler);
