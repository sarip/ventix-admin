/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    experimental: {
        forceSwcTransforms: true,
    },

    // Proxy API requests to the backend on port 8080
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://localhost:8080/api/v1/:path*',
            },
            {
                source: '/frontend/api/v1/:path*',
                destination: 'http://localhost:8080/frontend/api/v1/:path*',
            },
        ];
    },

    webpack: (config) => {
        config.module.rules.push({
            test: /\.(js|jsx)$/,
            exclude: /node_modules/, // Exclude node_modules from Babel processing
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['next/babel'],
                    compact: false, // Prevents Babel from applying compact mode
                },
            },
        });

        return config;
    },
};

export default nextConfig;

