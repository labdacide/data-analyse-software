import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      email: string;
      workspace: string;
      demo?: true;
    };
  }
}

export const authConfig = {
  cookieName: process.env.COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  password: process.env.SESSION_SECRET,
};

export const withApiAuth = (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, authConfig);

export const withAdminAuth =
  (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    const {
      headers: { authorization },
    } = req;
    if (
      !authorization ||
      authorization.split(" ")[1] !== process.env.AUTHORIZATION
    ) {
      return res.status(401).end();
    }
    return handler(req, res);
  };

export const withPublicAuth = (handler?: any) =>
  withIronSessionSsr(async ({ req, res }) => {
    const user = req.session.user;
    if (!user) {
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }
    await req.session.save();
    if (handler) {
      const { props } = await handler(req, res);
      return { props: { ...props, user } };
    } else {
      return { props: { user } };
    }
  }, authConfig);
