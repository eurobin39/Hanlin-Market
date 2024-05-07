"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

// Function to update the product status
export async function updateStatus(productId: number, newStatus: 'ACTIVE' | 'RESERVED' | 'COMPLETED') {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        return false;
    }

    const product = await db.product.findUnique({
        where: {
            id: productId,
            userId,
        },
    });

    if (!product) {
        return false;
    }

    await db.product.update({
        where: {
            id: productId,
        },
        data: {
            status: newStatus,
        }
    });
    revalidatePath(`/products/${product.id}`);
    return true;
    
}
