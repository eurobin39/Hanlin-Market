import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";


export default function CreateAccount(){
return(

    <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 items-center justify-between *:font-medium">
            <h1 className="text-2xl">HANLIN</h1>
            <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <form className="flex flex-col gap-3 px-10">
            <FormInput 
            name ="text"
            required
            type="text"
            placeholder="Username"
            errors ={[]}/>
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
            errors ={[]}/>
            <FormInput 
            name ="confirmPassword"
            required
            type="confirmPassword"
            placeholder="confirm Password"
            errors ={[]}/>
            <FormButton
                loading={false}
                text="Create Account" 
            />
        </form>
        <SocialLogin />
        </div>
  
);
}
