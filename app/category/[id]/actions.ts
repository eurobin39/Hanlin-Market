"use server"

import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getMoreCategoryProducts(page: number, categoryId?: number) {
    const categoryProducts = db.product.findMany({
        where: {
            categoryId: categoryId,
        },
        select: {
            title: true,
            price: true,
            created_At: true,
            photo: true,
            status: true,
            categoryId: true,
            id: true,
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
    return categoryProducts;
}
     
