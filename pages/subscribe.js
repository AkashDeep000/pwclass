import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import axios from "axios"
import {useState} from "react"
import { setCookies, getCookie } from 'cookies-next'
import { useRouter } from 'next/router'


import styles from '../styles/Home.module.css'
import Header from '../components/Header'
export default function Payment() {
  const [isLoading, setIsLoading] = useState("false")
  const number = getCookie('number')
  const router = useRouter()
   if (typeof window) {
     function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => { 
			resolve(false)
		}
		document.body.appendChild(script)
	})
}
}

  
  
  const subClicHandler = async () => {
    
    setIsLoading("true")
    
    const RazorpayLoad = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
   
    if (RazorpayLoad) {
      const res = await axios({
      method: 'post',
  url: "/api/payment/razorpay",
  data: {number: number}
    })
const data = res.data
		console.log(data)
setIsLoading("false")

//production key
//	key: 'rzp_live_EwHLrT8UTaUgoG
//testing
//key: 'rzp_test_dhlZTnBnAibhF6',
		const options = {
			key: 'rzp_live_EwHLrT8UTaUgoG',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'PW class Subscription',
			description: 'Thank you for taking the Subscription',
			image: '/pwclass-logo.jpg',
			handler: async function (response) {
			  setIsLoading("done")
			  await setCookies('isSubscribed', true)
			  const delay = ms => new Promise(res => setTimeout(res, ms));
			  await delay(5000)
			  router.push("/")
        
			  /*
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
				*/
				
			},
			
			prefill: {
				full_name: "",
				email: "",
				phone: number
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
    }
  }
  
  return (
    <>
    <Header/>
    <div className="bg-white rounded shadow-sm m-2">
      <h2 className="text-slate-500 text-center text-lg font-bold p-4"> 
    Buy A Subscription 
    <br />
    For 1 Month
    <br />(Unlimited Download)
    </h2>
     <div className="bg-slate-100 rounded text-center p-8">

        <span className="rounded text-sky-500  text-8xl font-bold p-4"> 
     ₹1
    </span>
    </div>
          <div className="text-slate-500 text-center text-xl font-bold p-4"> 
      <button onClick={subClicHandler}
      className="bg-sky-500 text-white p-2.5 text-2xl rounded-md border-2 border-sky-500 w-48">
      {isLoading == "false" ?
      "Subscribe Now"
       : isLoading == "true" ?
       <div>
      <svg role="status" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="rgba(255,255,255,0.792)"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="rgb(255,255,255)"/>
</svg>
Loading...
</div>
 : isLoading == "done" ?
 "Payment Successful🎊"
 : null
      }
      </button>
      </div>
    </div>
  
     </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
   const token = await getCookie('access_token', { req, res});
   const number = await getCookie('number', { req, res});
   if (!token || !number) {
   return  {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
} else {
  return {props:{}}
}
}