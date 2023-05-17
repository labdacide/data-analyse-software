declare namespace NodeJS {
    interface ProcessEnv {
        readonly NEXT_PUBLIC_URI: string;
        readonly BACKEND_URI: string;
        readonly COOKIE_NAME: string;
        readonly SESSION_SECRET: string;
        readonly TOKEN_SECRET: string;
        readonly AUTHORIZATION: string;
        readonly DATABASE_URL: string;
        readonly ALCHEMY_API_KEY_ETH: string;
        readonly ALCHEMY_API_KEY_POLYGON: string;
    }
}
