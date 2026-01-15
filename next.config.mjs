/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // 👈 penting!
    // images: {
    //     unoptimized: true, // untuk static hosting di cPanel
    // },
    // trailingSlash: true, // opsional, biar URL /about jadi /about/
    // // ⚡ Tambahkan ini:
    // basePath: '',
    // assetPrefix: process.env.NEXT_PUBLIC_SITE_URL || '',
    // env: {
    //     NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    //     NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // },
    //
    //

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
