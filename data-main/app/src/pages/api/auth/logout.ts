import { withApiAuth } from "@/utils/auth";

async function handler(req: any, res: any) {
  await req.session.destroy();
  return res.redirect("/login");
}

export default withApiAuth(handler);
