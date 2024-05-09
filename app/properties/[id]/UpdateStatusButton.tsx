"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

// Function to update the product status
export async function updateStatus(homeId: number, newStatus: 'ACTIVE' | 'RESERVED' | 'COMPLETED') {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        return false;
    }

    const product = await db.home.findUnique({
        where: {
            id: homeId,
            userId,
        },
    });

    if (!product) {
        return false;
    }

    await db.home.update({
        where: {
            id: homeId,
        },
        data: {
            status: newStatus,
        }
    });
    revalidatePath(`/properties/${product.id}`);
    return true;
    
}
