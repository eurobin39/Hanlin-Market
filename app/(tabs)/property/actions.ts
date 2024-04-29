"use server"

import db from "@/lib/db";

export async function getMoreProperties(page: number) {
    const properties = await db.home.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            photos: true,
            created_At: true,
            _count: {
                select: {
                    like: true,
                }
            }
        },
        skip: page * 1, // 이 부분도 수정하면 좋을 듯, page * 1 보다는 명시적으로 아이템 수를 곱해야 합니다.
        take: 1,
        orderBy: {
            created_At: "desc",
        }
    });
    return properties;
}
