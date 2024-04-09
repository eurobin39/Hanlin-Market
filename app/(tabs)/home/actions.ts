"use server"

import db from "@/lib/db";

export async function getMoreProducts(page:number){
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_At: true,
            photo: true,
            id: true,
        },
        skip: page*5,
        take: 5,
        orderBy:{
            created_At:"desc",
        }
    });
    return products;
}