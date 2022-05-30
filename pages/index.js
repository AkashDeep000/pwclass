import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getCookie, removeCookies } from 'cookies-next'
import DateDiff from "date-diff"
import styles from '../styles/Home.module.css'
import { connectToDatabase } from "../util/mongodb";
import Header from '../components/Header'
export default function Home({data}) {
  console.log(data.data.data[0])
  return (
    <>
    <Header/>
    <div className="text-center w-full text-3xl font-bold text-slate-600 p-2 mt-4">Your Batches</div>
    <div className="grid p-3 gap-6 shadow-2xl">
    {data.data.data.map((el, i) => (
    <div key={i} >
    <Link href={`/${el._id}`}>
    <img
    width={1600}
    height={900}
       className="rounded w-full aspect-video" src={el.previewImage.baseUrl + el.previewImage.key}/>
</Link>
    </div>
    
  ))}
  </div>  
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
   const token = await getCookie('access_token', { req, res});
    
   const number = await getCookie('number', { req, res});
   const isSubscribed = await getCookie('isSubscribed', { req, res});
  
   if (!token) {
   return  {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
   }
   const data = await fetch('https://api.penpencil.xyz/v3/batches/my-batches?page=1&mode=1', { 
   method: 'get', 
   headers: new Headers({
     'Authorization': `Bearer ${token}`,
     'client-type':	'WEB',
'client-id':	'5eb393ee95fab7468a79d189',
'client-version':	'99',
'randomId':	'3da41478-2a67-4290-ad42-796180bc7017'
   })
 });
 const batches = await data.json()
  let haveToReturn = { props: {}};
 if (batches.error?.status == 401) {
   removeCookies('access_token', { req, res})
   removeCookies('number', { req, res})
   removeCookies('isSubscribed', { req, res})
   haveToReturn = {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
 } else if (batches.success == true){
     const { db } = await connectToDatabase();
  const user = await db.collection('users')
         .findOne({
           number: number
         })
    console.log(user)
  const curDate = new Date()
   const subDate = user.subDate ? user.subDate : new Date(1999)
    const diff = new DateDiff(curDate, subDate);
    
    const dateDiff = diff.days()
    const haveSub = dateDiff <=28 ? true : false;
  if (!haveSub) {
    removeCookies('isSubscribed', { req, res});
  } else {
    setCookies("isSubscribed", true, {req, res})
  }
  haveToReturn = { props: {data:{token: token,data:batches}}};
}
console.log(haveToReturn)
return haveToReturn
}
//https://api.penpencil.xyz/v3/batches/6229aba1c906350011f5b73b/details