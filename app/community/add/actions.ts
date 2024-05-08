"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";



const productSchema = z.object({
    
    title: z.string({
        required_error: "title is Required"
    }),
    description: z.string({
        required_error: "description is Required"
    }),
    
    categoryId: z.coerce.number({
        required_error: "category is Required"
    })
})
export async function uploadProduct(_: any, formData: FormData) {
    const data = {
        
        title: formData.get("title") as string || "Default Title",
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
            const post = await db.post.create({
                data: {
                    title: data.title,
                    description: data.description,
                    PostCategory: {
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
            redirect(`/community/${post.id}`)
        } catch (error) {
            console.error("Database error: ", error);
            throw error;
        }
    }
}

    export async function getCategories() {
        const categories = db.postCategory.findMany();
        return categories;
    }