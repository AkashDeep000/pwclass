import { RiVideoDownloadLine } from "react-icons/ri";
import {getCookies, removeCookies } from 'cookies-next'
import {useState, useRef, useEffect} from "react"
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function Header() {
 
const cookies =  getCookies()

const [isLogin, setIsLogin] = useState(false)
const [isSubscribed, setIsSubscribed] = useState(false)
  const router = useRouter()
const handleLoginClick = () => {
  if (!isLogin) {
    router.push("/login")
  } else {
    removeCookies('access_token')
    removeCookies('number')
    removeCookies('isSubscribed')
    router.push("/login")
  }
}
 useEffect(() => {
   console.log(cookies)
   if (cookies?.access_token) {
     setIsLogin(true)
   }
   if (cookies?.isSubscribed == "true") {
     console.log("in:"+cookies.isSubscribed)
     setIsSubscribed(true)
   }
   console.log("out:"+isSubscribed)
 },[cookies]) 
 
  return (
    <>

      <div className="backdrop-blur-md grid justify-between grid-cols-[1fr_auto_auto] gap-2 lg:gap-4 bg-white/70 sticky top-0 w-full shadow-sm px-2 py-4">
        <Link href="/">
      <div className="p-0 text-2xl font-bold text-slate-700 font-sans">
      <span className="inline">PW-class </span>
        <RiVideoDownloadLine className="inline w-12 h-12"/>

      </div>
      </Link>
      {(!isSubscribed && isLogin) ?
    <Link href="/subscribe">
      <button 
      className="text-sky-500 px-2 h-12 text-lg rounded-3xl border-2 border-sky-500">
      Subscribe
      </button>
      </Link> :
      null}
      <button onClick={handleLoginClick} className="bg-sky-500 text-white px-3 h-lg text-xl rounded">{isLogin ? "Log Out" : "Login"}</button>
       </div>
     </>
  )
}