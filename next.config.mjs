/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'iguov8nhvyobj.vcdn.cloud'
            }
        ]
    }
};

export default nextConfig;
