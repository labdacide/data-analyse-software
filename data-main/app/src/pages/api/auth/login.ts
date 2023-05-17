import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";
import { compare } from "bcrypt";

async function handler(req: any, res: any) {
  const { email, password } = req.body;
  const user = await db.user.findUnique({
    where: { email },
    include: { workspaces: true },
  });

  if (!user) return res.redirect(`/login?status=404`);

  if (!(await compare(password, user.hashedPassword))) {
    if (!user) return res.redirect(`/login?status=401`);
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    workspace: user.workspaces[0].workspaceName,
  };
  if (email === "demo@me3x.xyz") {
    req.session.user.demo = true;
  }
  await req.session.save();
  return res.redirect("/");
}

export default withApiAuth(handler);
