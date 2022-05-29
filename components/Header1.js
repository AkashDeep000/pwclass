import { RiVideoDownloadLine } from "react-icons/ri";
import { checkCookies, removeCookies } from 'cookies-next'
import {useState, useRef, useEffect} from "react"
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function Header() {
 
const isToken = checkCookies('access_token')
const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
const handleLoginClick = () => {
  if (!isLogin) {
    router.push("/login")
  } else {
    removeCookies('access_token')
    router.push("/login")
  }
}
 useEffect(() => {
   if (isToken) {
     setIsLogin(true)
   }
 },[isToken])
 
  return (
    <>

      <div className="backdrop-blur-md grid justify-between grid-cols-[auto_auto_auto] bg-white/70 sticky top-0 w-full shadow-sm px-2 py-4">
        <Link href="/">
      <div className="p-0 text-2xl font-bold text-slate-700 font-sans">
      <span className="inline">PW-class </span>
        <RiVideoDownloadLine className="inline w-12 h-12"/>
      </div>
      </Link>
    <Link href="/payment">
      <button 
      className="text-sky-500 px-3 h-12 text-xl rounded-full border-2 border-sky-500">
      ₹100
      <p className="bg-sky-500 text-white rounded-full">+</p>
      </button>
      </Link>
      <button onClick={handleLoginClick} className="bg-sky-500 text-white px-3 h-12 text-xl rounded">{isLogin ? "Log Out" : "Login"}</button>
       </div>
     </>
  )
}