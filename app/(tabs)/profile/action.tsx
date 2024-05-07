"use client"

import getSession from "@/lib/session";
import { useRouter } from "next/navigation";

export default async function logout() {
    "use server";
    const router = useRouter();

    const session = await getSession();
    await session.destroy();
    router.push("/");

}