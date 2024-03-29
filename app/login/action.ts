"use server";

import {z} from "zod";
import {PASSWORD_REGEX} from "@/lib/constants";

const formSchema = z.object(
    {
        email:z.string().email().toLowerCase(),
        password:z.string().min(10).regex(PASSWORD_REGEX, "password must have lowercase, UPPERCASE, number and special Character!"),
    }
)
export async function login(prevState: any, formData: FormData) {
    
    const data = {
        email:formData.get("email"),
        password:formData.get("password"),
    }
    return{
        errors : ["password Wrong!", "password is too short!"],
    };
}