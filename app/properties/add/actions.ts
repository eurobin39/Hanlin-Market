"use server";
import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const propertiesSchema = z.object({
    photos: z.array(z.string()).nonempty({
        message: "At least one photo is required",
    }),
    title: z.string({
        required_error: "Title is required"
    }),
    description: z.string({
        required_error: "Description is required"
    }),
    price: z.coerce.number({
        required_error: "Price is required"
    }),

});
export async function uploadProperties(_: any, formData: FormData) {
    const photosData = formData.get("photoUrls");
    let photosUrls = [];

    if (photosData) {
        try {
            photosUrls = JSON.parse(photosData as string);
        } catch (error) {
            console.error("Error parsing photos data:", error);
            return { error: "Invalid photo data provided." };
        }
    }

    const data = {
        photos: photosUrls,
        title: formData.get("title") as string || "Default Title",
        price: Number(formData.get("price") || 0),
        description: formData.get("description") as string || "No description provided",
        location: formData.get("location") as string || "Unknown location",
        contractStart: new Date(formData.get("contractStart") as string),
        contractEnd: new Date(formData.get("contractEnd") as string),
    };

    const result = propertiesSchema.safeParse(data);
    
    if (!result.success) {
        console.error(result.error);
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session && session.id) {
            const properties = await db.home.create({
                data: {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    photos: data.photos,
                    location: data.location,
                    contractStart: data.contractStart,
                    contractEnd: data.contractEnd,
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
            redirect(`/properties/${properties.id}`);
        }
    }
}


export async function getUploadUrls(numOfFiles: number) {
    if (numOfFiles < 1 || numOfFiles > 4) {
        throw new Error("Number of files must be between 1 and 4.");
    }
    
    const urls = [];
    for (let i = 0; i < numOfFiles; i++) {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            }
        });
        const data = await response.json();
        if (response.ok && data.success) {
            urls.push({
                id: data.result.id,
                uploadURL: data.result.uploadURL
            });
        } else {
            console.error(`Error fetching upload URL for file ${i + 1}:`, data.errors);
            throw new Error(`Failed to retrieve upload URL for file ${i + 1}.`);
        }
    }
    
    return {
        success: true,
        results: urls
    };
}
