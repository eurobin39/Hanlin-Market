"use server"

import db from "@/lib/db";
import getSession from "@/lib/session";

// Cloudflare에서 이미지를 삭제하는 함수
async function deleteURL(imageId: string) {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        }
    });
    const data = await response.json();
    return data;
}

// 상품을 삭제하는 함수
export default async function deleteProductAction(homeId: number) {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        return false;
    }

    // 먼저 상품 정보를 조회합니다.
    const home = await db.home.findUnique({
        where: {
            id: homeId,
            userId,
        },
    });

    if (!home) {
        return false;
    }

    // 상품의 photo URL에서 imageId를 추출합니다.
    const imageIdMatch = home.photos[0].match(/imagedelivery\.net\/[^\/]+\/([^\/]+)/);
    if (!imageIdMatch) {
        console.error('Failed to extract imageId from photo URL');
        return false;
    }
    const imageId = imageIdMatch[1];

    // Cloudflare에서 이미지를 삭제합니다.
    await deleteURL(imageId);

    // 데이터베이스에서 상품을 삭제합니다.
    await db.home.delete({
        where: {
            id: homeId,
            userId,
        },
    });

    return true;
}
