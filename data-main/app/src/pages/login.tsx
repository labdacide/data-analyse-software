import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="h-screen bg-white flex">
            <Head>
                <title>Login | Me3x</title>
            </Head>

            <div className="bg-white border-r w-2/3 flex items-center justify-center">
                <form
                    action="/api/auth/login"
                    method="POST"
                    className="px-10 py-8 flex flex-col space-y-8"
                >
                    <div>
                        <h1 className="text-xl text-black font-medium mb-2">
                            Sign in
                        </h1>
                        <p className="text-sm font-light text-gray-600">
                            New to me3x?{" "}
                            <Link href="/signup">
                                <a className="text-blue-600">
                                    Sign up for an account
                                </a>
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="text-xs text-black p-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="text-sm text-gray-800 py-2 px-3 rounded-lg border"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="password"
                                className="text-xs text-black p-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="text-sm text-gray-800 py-2 px-3 rounded-lg border"
                            />
                        </div>
                    </div>
                    <input
                        type="submit"
                        value="Sign in"
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
