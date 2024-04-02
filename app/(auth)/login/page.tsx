"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "./action"

export default function Login(){
    const [state, action ] = useFormState(login, null);
    
return(
    <div className="flex flex-col justify-between items-center gap-5 px-6 py-5">
        <div className="flex flex-col justify-between items-center gap-10 w-full px-10">
            <Link href="/"className="font-bold text-4xl">HANLIN</Link>
        <form action={action} className="flex flex-col gap-3 w-full">
            <Input 
            name ="email"
            required
            type="email"
            placeholder="Email"
            errors ={state?.fieldErrors.email}/>
            <Input
            name ="password"
            required
            type="password"
            placeholder="Password"
            errors ={state?.fieldErrors.password} />
             <FormButton
                text="Login"/>
        </form>    
        </div>
        <SocialLogin />
    </div>
);
}