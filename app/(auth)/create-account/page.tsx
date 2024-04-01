"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Link from "next/link";


export default function CreateAccount(){
    const [state, action] = useFormState(createAccount, null);

return(

    <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 items-center justify-between *:font-medium">
        <Link href="/"className="font-bold text-4xl">HANLIN</Link>
            <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <form action={action} className="flex flex-col gap-3 px-10">
            <Input 
            name ="username"
            required
            type="text"
            placeholder="Username"
            errors={state?.fieldErrors.username}
            />
            <Input 
            name ="email"
            required
            type="email"
            placeholder="Email"
            errors={state?.fieldErrors.email}
            />
            <Input 
            name ="password"
            required
            type="password"
            placeholder="Password"
            errors={state?.fieldErrors.password}
            />
            <Input 
            name ="confirmPassword"
            required
            type="password"
            placeholder="confirm Password"
            errors={state?.fieldErrors.confirmPassword}
            />
            <Button
                text="Create Account" 
            />
        </form>
        <SocialLogin />
        </div>
  
);
}
