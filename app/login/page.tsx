
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import Link from "next/link";

export default function Login(){
    async function handleForm(formData: FormData) {
        "use server";
        console.log(formData.get("email"), formData.get("password"));
        
        console.log("Server is Running");
    }
return(
    <div className="flex flex-col justify-between items-center gap-5 px-6 py-5">
        <div className="flex flex-col justify-between items-center gap-10 w-full px-10">
            <h1 className="font-bold text-4xl">HANLIN</h1>
        <form action={handleForm} className="flex flex-col gap-3 w-full">
            <FormInput 
            name ="email"
            required
            type="email"
            placeholder="Email"
            errors ={[]}/>
            <FormInput
            name ="password"
            required
            type="password"
            placeholder="Password"
            errors ={[]} />
             <FormButton
                loading={false}
                text="Login" />
        </form>    
        </div>
        <SocialLogin />
    </div>
);
}