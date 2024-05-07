"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";



const productSchema = z.object({
    photo: z.string({
        required_error: "photo is Required"
    }),
    title: z.string({
        required_error: "title is Required"
    }),
    description: z.string({
        required_error: "description is Required"
    }),
    price: z.coerce.number({
        required_error: "price is Required"
    }),
    categoryId: z.coerce.number({
        required_error: "category is Required"
    })
})
export async function uploadProduct(_: any, formData: FormData) {
    const data = {
        photo: formData.get("photo") as string || "Default IMG",
        title: formData.get("title") as string || "Default Title",
        price: Number(formData.get("price") || 0),
        description: formData.get("description") as string || "No description provided",
        categoryId: parseInt(formData.get("categoryId") as string)  // categoryId를 정수로 파싱
    };

    console.log(data);

    const result = productSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (!session || !session.id) {
            throw new Error("Unauthorized: No active session found.");
        }

        // 카테고리 존재 여부 확인
        const categoryExists = await db.category.findUnique({
            where: {
                id: data.categoryId
            }
        });

        if (!categoryExists) {
            throw new Error(`No Category found with ID: ${data.categoryId}`);
        }


        // 제품 생성
        try {
            const product = await db.product.create({
                data: {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    photo: data.photo,
                    Category: {
                        connect: {
                            id: data.categoryId
                        }
                    },
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true,
                }
            });
            redirect(`/products/${product.id}`)
        } catch (error) {
            console.error("Database error: ", error);
            throw error;
        }
    }
}


    export async function getUploadUrl() {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`
            , {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                }
            }
        );
        const data = await response.json();
        return data;

    }

    export async function getCategories() {
        const categories = db.category.findMany();
        return categories;
    }