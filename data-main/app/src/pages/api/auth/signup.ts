import { withApiAuth } from "@/utils/auth";
import { db } from "@/utils/db";
import { hash } from "bcrypt";

async function handler(req: any, res: any) {
  const { email, fullname, password, workspace, code } = req.body as {
    [k: string]: string;
  };

  if (code !== "EARLY_ME3X") {
    return res.status(401).redirect("/signup?status=401");
  }

  const hashedPassword = await hash(password, 12);
  const user = await db.user.create({
    data: {
      email,
      hashedPassword,
      fullname,
      workspaces: {
        create: [
          {
            workspace: {
              connect: { name: workspace },
            },
          },
        ],
      },
    },
  });

  req.session.user = {
    id: user.id,
    email,
    workspace,
  };
  await req.session.save();

  return res.status(201).redirect("/");
}

export default withApiAuth(handler);
