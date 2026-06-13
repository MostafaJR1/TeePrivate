import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com"
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
            },
        ]
    },
    allowedDevOrigins: ['192.168.1.197', 'localhost']
};

export default nextConfig;
