import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import axios from "axios"
import {useState, useRef, useEffect} from "react"
import { checkCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'

import styles from '../styles/Home.module.css'
import Header from '../components/Header'
export default function Home() {
  const [number,setNumber] = useState()
  const [otp,setOtp] = useState()
  const [submitText,setSubmitText] = useState("Submit")
  const [otpText,setOtpText] = useState("Get OTP")
  const [isOtpSend, setIsOtpSend] = useState(false)
  const [isOtpVer, setIsOtpVer] = useState(false)
  const router = useRouter()
  const {token} = router.query
  if (token) {
    setCookies('access_token', token)
     setCookies('number', 9144762281)
     setCookies('isSubscribed', true)
     router.push("/")
  }
  /*
  setCookies('access_token', 'a9a5c7dfa81e1ae9dbae041f87d0d472d79e8c616c073e8143f3cf45b8185d77')
  setCookies('number', 9144762281)
  setCookies('isSubscribed', true)
  
  */
  
 const isLogin = checkCookies("access_token")
    useEffect(() => {
   
   if (isLogin) {
     router.push('/')
   }
    },[])
  
  const handleOtpClick = async() => {
    console.log("Clicked for Otp")
    if (number?.length == 10) {
      console.log(10)
    setOtpText("Wait...")
    const otpRes = await axios({
      method: 'post',
  url: "/api/otp",
  data: {number: number}
    })
    if (otpRes.data.success) {
      setIsOtpSend(true)
      console.log("Otp Send Successfull")
    } else {
      setOtpText("Get OTP")
    }
    }
  }
  
  const handleOtpVer = async() => {
    console.log("Verifying OTP")
    if (otp?.length === 6) {
      console.log(6)
  setSubmitText("Verifying...")
    const otpRes = await axios({
      method: 'post',
  url: "/api/token",
  data: {number: number,otp:otp}
    })
    if (otpRes.data.success) {
      setIsOtpVer(true)
      console.log("Login Successfull", otpRes)
      await setCookies('access_token', otpRes.data.data.access_token)
      await setCookies('number', otpRes.data.data.number)
      await setCookies('isSubscribed', otpRes.data.data.isSubscribed)
      
      
      router.push("/")
    } else {
      setSubmitText("Submit")
    }
    }
  }
  
  return (
    <>
    <Header/>
    <div className="px-8 pt-3 grid center">
      <div className=" w-full text-2xl font-bold text-slate-600 pb-8 mt-4">First Loging with Your Physics Wallah Account.</div>
    <label className="w-full  text-xl block text-sky-500">
    Phone Number:
    <input
    onChange={(e) => setNumber(e.target.value)}
    className="w-full text-3xl my-3 p-4"
    value={number}
    type="number" name="number" />
    </label>
      <div style={isOtpSend ? {display: "none"}: null}>
    <button 
    onClick={handleOtpClick}
    style={number?.length === 10 ? {background:"#00bae8"} : null}
    className="bg-sky-300 text-white p-3 text-xl rounded w-32">{otpText}</button>
    </div>
    <div style={!isOtpSend ? {display: "none"}: null}>
        <label className="w-full text-xl block text-sky-500">
    Phone OTP:
    <input className="w-full text-3xl my-3 p-4" 
    onChange={(e) => setOtp(e.target.value)}
    value={otp}
    type="number" name="otp" />
 </label>
    <button
    onClick={handleOtpVer}
    style={otp?.length === 6 ? {background:"#00bae8"} : null}
    className="bg-sky-300 text-white p-3 text-xl my-4 rounded w-32">{submitText}</button>
    </div>
 </div>
     </>
  )
}
