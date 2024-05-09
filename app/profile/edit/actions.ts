'use server'

import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { PASSWORD_REGEX } from "@/lib/constants";

interface UpdateData {
    username?: string;
    avatar?: string;
    password?: string;
}

const checkPassword = ({ password, confirmPassword }: { password?: string; confirmPassword?: string }) => {
    if (password && confirmPassword) {
        return password === confirmPassword;
    }
    return true; // 비밀번호 변경을 원하지 않는 경우, 항상 true를 반환
};

const productSchema = z.object({
    photo: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(10).regex(PASSWORD_REGEX, "Password must have lowercase, UPPERCASE, number and special character!").optional(),
    confirmPassword: z.string().min(10).optional(),
}).superRefine(async ({ username }, ctx) => {
    if (username) {
        const user = await db.user.findUnique({
            where: { username },
            select: { id: true }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "This username is already taken",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    }
}).refine(checkPassword, {
    message: "Confirm password is different!",
    path: ["confirmPassword"],
});

export async function updateProfile(_: any, formData: FormData) {
    const data = {
        photo: formData.get("photo") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = productSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (!session || !session.id) {
            throw new Error("Unauthorized: No active session found.");
        }

        const updateData: UpdateData = {};

        if (data.username) {
            updateData.username = data.username;
        }
        if (data.photo) {
            updateData.avatar = data.photo;
        }
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 12);
        }

        try {
            const user = await db.user.update({
                where: { id: session.id },
                data: updateData,
            });
            redirect(`/profile`);
        } catch (error) {
            console.error("Database error: ", error);
            throw error;
        }
    }
}

export async function getUploadUrl() {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` },
    });
    const data = await response.json();
    return data;
}
