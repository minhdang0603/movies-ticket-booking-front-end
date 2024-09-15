/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'iguov8nhvyobj.vcdn.cloud'
            },
            {
                protocol: 'https',
                hostname: 'www.galaxycine.vn'
            }
        ]
    }
};

export default nextConfig;
