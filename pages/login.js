import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import axios from "axios"
import {useState, useRef} from "react"
import { setCookies } from 'cookies-next'
import { useRouter } from 'next/router'


import styles from '../styles/Home.module.css'
import Header from '../components/Header'
export default function Home() {
  const [number,setNumber] = useState()
  const [otp,setOtp] = useState()
  const [isOtpSend, setIsOtpSend] = useState(false)
  const [isOtpVer, setIsOtpVer] = useState(false)
  const router = useRouter()
  
  const handleOtpClick = async() => {
    console.log("Clicked for Otp")
    if (number?.length == 10) {
      console.log(10)
    
    const otpRes = await axios({
      method: 'post',
  url: "/api/otp",
  data: {number: number}
    })
    if (otpRes.data.success) {
      setIsOtpSend(true)
      console.log("Otp Send Successfull")
    }
    }
  }
  
  const handleOtpVer = async() => {
    console.log("Verifying OTP")
    if (otp?.length === 6) {
      console.log(6)
  
    const otpRes = await axios({
      method: 'post',
  url: "/api/token",
  data: {number: number,otp:otp}
    })
    if (otpRes.data.success) {
      setIsOtpVer(true)
      console.log("Login Successfull")
      await setCookies('access_token', otpRes.data.data.access_token)
      router.push("/")
    }
    }
  }
  
  return (
    <>
    <Header/>
    <div className="px-8 pt-8 grid center">
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
    className="bg-sky-300 text-white p-3 mx-24 text-xl rounded">Get OTP</button>
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
    className="bg-sky-300 text-white p-3 mx-24 text-xl my-4 rounded">Submit</button>
    </div>
 </div>
     </>
  )
}
