import { InputHTMLAttributes } from "react";

interface InputProps{
    
    errors?:string[];
    name:string;

}
export default function Input({name, errors=[], ...rest}: InputProps & InputHTMLAttributes<HTMLInputElement>){
    return(
        <div className="flex flex-col gap-2">
             
            <input 
                name={name}
                className="bg-transparent rounded-md w-full h-10 focus:outline-none
                 ring-1 focus:ring-2 ring-neutral-200 focus:ring-green-500 border-none
                 placeholder:text-neutral-400 pl-3"
                 {...rest}
                 />
            {errors && errors.map((error, index) => <span key={index} className="text-red-500 font-medium">{error}</span>)}
        </div>
    )
}