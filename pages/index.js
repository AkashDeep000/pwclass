import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getCookie, removeCookies } from 'cookies-next'
import styles from '../styles/Home.module.css'
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
  haveToReturn = { props: {data:{token: token,data:batches}}};
}
console.log(haveToReturn)
return haveToReturn
}
//https://api.penpencil.xyz/v3/batches/6229aba1c906350011f5b73b/details