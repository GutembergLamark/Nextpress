/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const config = {
    rewrites: async () => {
        return [
            {
                source: '/(.*)sitemap.xml',
                destination: '/essentials/sitemap-proxy',
            },
            {
                source: '/sitemap(.*).xml',
                destination: '/essentials/sitemap-proxy',
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: process.env.IMAGEPROTOCOL,
                hostname: process.env.IMAGEHOSTNAME,
                port: '',
                pathname: '/**',
            },
        ],
    },
}

const nextConfig = withBundleAnalyzer(config)

module.exports = nextConfig
