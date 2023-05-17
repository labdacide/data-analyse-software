/** @type {import('next').NextConfig} */
const path = require("path");

function generateIncludes(modules) {
  return [
    new RegExp(`(${modules.join("|")})$`),
    new RegExp(`(${modules.join("|")})/(?!.*node_modules)`),
  ];
}

const includes = generateIncludes(["recharts"]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: "loose", // https://nextjs.org/docs/messages/import-esm-externals
  },
  webpack: (config, options) => {
    // Big thanks to https://github.com/d3/d3-format/issues/114#issuecomment-826338584
    config.externals = config.externals.map((external) => {
      if (typeof external !== "function") return external;
      return ({ context, request, dependencyType, getResolve }, callback) => {
        return includes.find((i) =>
          i.test(
            request.startsWith(".") ? path.resolve(context, request) : request
          )
        )
          ? callback() // i.e., not an external
          : external(
              { context, request, dependencyType, getResolve },
              callback
            );
      };
    });
    return config;
  },
};

module.exports = nextConfig;
