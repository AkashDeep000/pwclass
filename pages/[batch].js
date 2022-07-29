import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { getCookie, removeCookies } from 'cookies-next'

import Header from '../components/Header'
export default function Home({data}) {
 // console.log(data.data.data.subjects[0])
  return (
    <>
    <Header/>
    <div className="text-center w-full text-3xl font-bold text-slate-600 p-2 mt-4">Subjects</div>
    <div className="grid grid-cols-2 p-3 gap-6 shadow-2xl">
    {data.data.data.subjects.map((el, i) => (
    <div key={i} >
        <Link href={`/${data.batchId}/${el._id}`}>
    <div className="rounded w-full aspect-square text-center w-full text-2xl font-bold text-slate-600 p-2 bg-white grid place-items-center">
    <p>{el.subject}</p>
    </div>
    </Link>

    </div>
    
  ))}
  </div>  
    </>
  )
}

export const getServerSideProps = async ({ req, res, params}) => {
  const { batch } =  params
   const token = await getCookie('access_token', { req, res, params});
   if (!token) {
   return  {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
}
   console.log(params)
   const data = await fetch(`https://api.penpencil.xyz/v3/batches/${batch}/details`, { 
   method: 'get', 
   headers: new Headers({
     'Authorization': `Bearer ${token}`,
     'client-type':	'WEB',
'client-id':	'5eb393ee95fab7468a79d189',
'client-version':	'99',
'randomId':	'3da41478-2a67-4290-ad42-796180bc7017'
   })
   })
 
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
 } else if (batches?.success == true){
  haveToReturn = { props: {data:{token: token,batchId:batch,data:batches}}};
}
console.log(haveToReturn)
return haveToReturn
}
//https://api.penpencil.xyz/v3/batches/6229aba1c906350011f5b73b/details
