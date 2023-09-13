/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    webpack: (config) => {
        config.experiments = config.experiments || {}
        config.experiments.topLevelAwait = true
        return config
    },
    images: {
        remotePatterns: [
            {
                hostname: "lh3.googleusercontent.com",
            },

            {
                hostname: "avatars.githubusercontent.com",
            },
        ],
        domains: ["shopify.com", "cdn.shopify.com", "google.com", "github.com"],
    },
}

module.exports = nextConfig
