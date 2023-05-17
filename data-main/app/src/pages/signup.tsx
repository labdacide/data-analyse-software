import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import * as jwt from "jsonwebtoken";
import { db } from "@/utils/db";
import { GetServerSidePropsContext } from "next";

export default function SignupPage({ workspace }: { workspace?: string }) {
  return (
    <main className="h-screen bg-white flex">
      <Head>
        <title>Login | Me3x</title>
      </Head>

      <div className="bg-white border-r w-2/3 flex items-center justify-center">
        <form
          action="/api/auth/signup"
          method="POST"
          className="px-10 py-8 flex flex-col space-y-8 w-full max-w-xl"
        >
          <div>
            <h1 className="text-xl text-black font-medium mb-2">Sign up</h1>
            <p className="text-sm font-light text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-blue-600">Login</a>
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup name="email" type="email" required label="Email" />
            <InputGroup name="fullname" type="text" label="Full Name" />
            <InputGroup
              name="password"
              type="password"
              required
              label="Password"
            />
            <InputGroup
              name="confirm_password"
              type="password"
              required
              label="Confirm Password"
            />
            <div className="flex flex-col">
              <label htmlFor="workspace" className="text-xs text-black p-1">
                Workspace<span className="text-purple-400">*</span>
              </label>
              <div className="px-1 border rounded-lg focus-within:outline outline-2 outline-blue-600">
                <select
                  name="workspace"
                  required
                  className="w-full py-2 text-sm focus:outline-none"
                >
                  <option selected value={workspace}>
                    {workspace}
                  </option>
                </select>
              </div>
            </div>
            <InputGroup
              name="code"
              type="text"
              required
              label="Invitation Code"
            />
          </div>

          <input
            type="submit"
            value="Sign up"
            className="bg-black text-white rounded-lg py-2 px-4 text-sm cursor-pointer transition-shadow shadow-none hover:shadow-xl"
          />
        </form>
      </div>

      <div className="w-1/3 relative">
        <div className="absolute top-1/2 left-0 transform -translate-x-1/3 -translate-y-1/2 bg-white py-10 flex items-center space-x-2">
          {/* <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" /> */}
          <Image
            layout="fixed"
            width={32}
            height={32}
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-2xl text-black font-light">me3x</span>
        </div>
      </div>
    </main>
  );
}

interface InputGroupProps {
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  label: string;
}

const InputGroup = ({ name, label, type, required }: InputGroupProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-xs text-black p-1">
        {label}
        <span className="text-purple-400">{required && "*"}</span>
      </label>
      <input
        type={type}
        name={name}
        required
        className="text-sm p-2 text-gray-800 py-2 px-3 rounded-lg border"
      />
    </div>
  );
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const invite = query?.invite as string;
  let workspace = null;
  if (invite) {
    try {
      const decoded = jwt.verify(
        invite,
        process.env.TOKEN_SECRET
      ) as jwt.JwtPayload;
      const id = decoded.id;
      const space = await db.workspace.findUnique({ where: { id } });
      workspace = space?.name;
      console.log({ workspace });
    } catch (err) {
      console.log(err);
    }
  }

  return {
    props: { workspace },
  };
}
