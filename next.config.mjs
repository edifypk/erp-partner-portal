/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files-edify-group.s3.ap-southeast-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'erp-assets.edify.pk',
            },
            {
                protocol: 'https',
                hostname: 'admin.edify.pk',
            },
        ],
    },
};

export default nextConfig;
