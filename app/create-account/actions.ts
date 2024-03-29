"use server";

import {z} from "zod";

const checkUserName=(username:string) =>
!username.includes(".");

const checkPassWord=({password, confirmPassword } : {password:string, confirmPassword:string})=> 
password === confirmPassword;

const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$&^&*-]).+$/
)
const formSchema =z.object({
    username:z.string().min(3).max(10).trim().toLowerCase().refine(checkUserName, "username cant use specific character"),
    email:z.string().email().toLowerCase(),
    password:z.string().min(10).regex(passwordRegex, "password must have lowercase, UPPERCASE, number and special Character!"),
    confirmPassword:z.string().min(10),
}).refine( checkPassWord, {
    message : "confirm password is different!",
    path: ["confirmPassword"],
});

export async function createAccount(prevState:any, formData:FormData){
    const data = {
        username:formData.get("username"),
        email:formData.get("email"),
        password:formData.get("password"),
        confirmPassword:formData.get("confirmPassword"),

    };

    const result = formSchema.safeParse(data);
    if(!result.success){
        return result.error.flatten();
    }else{
        return console.log(result.data);
    }
}