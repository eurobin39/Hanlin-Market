/** @type {import('next').NextConfig} */
const nextConfig = {
    // 이미지 최적화 설정
    images: {
        remotePatterns: [
            {
                hostname: "imagedelivery.net",
            },
        ],
    },
    // 필요한 추가 설정을 여기에 추가
};

export default nextConfig;
