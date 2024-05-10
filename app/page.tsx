import Link from "next/link";

export default function Home() {
  return(

    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-3 *:font-medium">
        <span className="text-9xl" color="navy" > H </span>
        <h1 className="text-4xl"> HANLIN </h1>
        <h2 className="text-4xl"> Welcome To HANLIN </h2>
      </div>
     <div className="flex flex-col items-center gap-3 w-full">
       <Link href="/create-account"
        className="primary-btn py-2 h-15">JOIN</Link> 
        <div>
         <span className="p-2">Already had an account?</span>
         <Link href="/login" className="hover:underline underline-offset-2">Login</Link>
       </div>
      </div>
    </div>
  )
  
}
    