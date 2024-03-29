"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import Link from "next/link";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";



export default function SMSLogin(){

const initialState ={token: false};

const [state, dispatch] = useFormState(smsLogin, initialState);

return(
    <div className="flex flex-col justify-between items-center gap-5 px-6 py-5">
        <div className="flex flex-col justify-between items-center gap-5 w-full px-10">
        <Link href="/Main"className="font-bold text-4xl">HANLIN</Link>
            <h1 className="font-semibold text-2xl">SMS LOGIN</h1>
            <h2 className="font-normal text=2xl">Verify your Phone Number</h2>
        <form action = {dispatch} className="flex flex-col gap-3 w-full">
            <Input 
            name ="phone"
            required
            type="number"
            placeholder="Phone Number"
            errors ={[]}/>
            {state.token? <Input
            name ="token"
            required
            type="number"
            placeholder="Verification Code"
            min={100000}
            max={999999}
            errors ={[]}/> : null}
             <FormButton
                text="Verify" />
        </form>    
        </div>
    </div>
);
}