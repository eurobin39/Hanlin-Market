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
})
export async function uploadProduct(_: any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };


    /* 파일 비동기화 시 사용 코드(Global 파일에 저장)
    if(data.photo instanceof File){
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(`./public/${data.photo.name}`,Buffer.from(photoData));
        data.photo = `/${data.photo.name}`
    }
    */


    const result = productSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
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
            //redirect("/products")
        }
    }
    //console.log(data);
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