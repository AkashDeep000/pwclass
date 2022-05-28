import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { uid } from 'uid';
//import getAllChapter from "../../util/getAllChapter"
import { getCookie, removeCookies } from 'cookies-next'
import styles from '../../styles/Home.module.css'
import Header from '../../components/Header'
export default function Home({data}) {
 // console.log(data.data.data[0])
  return (
    <>
    <Header/>
    <div className="text-center w-full text-3xl font-bold text-slate-600 p-2 mt-4">Chapters</div>
    <div className="grid p-3 gap-6 shadow-2xl">
    {data.data.data.map((el, i) => 
    <>
{el.videos > 0 ?
    <div key={i} >
        <Link href={`/${data.batchId}/${data.subjectsId}/${el._id}`}>
    <div className="rounded w-full p-2 bg-slate-100 grid gap-4 grid-cols-[1fr_3rem] place-items-center">
    <p className="w-full text-xl font-bold text-slate-600">{el.name}</p>
    <p className="w-full rounded text-slate-400 bg-white p-2 text-center">{el.videos}</p>
    </div>
    </Link>

    </div>
    : null
}
</>
  )}
  </div>  
    </>
  )
}

export const getServerSideProps = async ({ req, res, params}) => {
  const token = await getCookie('access_token', { req, res});
   console.log(params, token)
   if (!token) {
   return  {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
}
  const { batch, subject } =  params
 let batches;
 let totalPage = 1;
 let currentPage = 1;
   const getBatches = async () => {
     const data = await fetch(`https://api.penpencil.xyz/v2/batches/${batch}/subject/${subject}/topics?page=${currentPage}`, { 
   method: 'get', 
   headers: new Headers({
     'Authorization': `Bearer ${token}`
   })
   })
 const result = await data.json()
 
 if (currentPage === 1) {
   batches = result
if (result.success) {
  totalPage = (Math.ceil(result.paginate.totalCount / result.paginate.limit))
   currentPage++
}
   
 } else if (currentPage > 1) {
   batches.data.push(...result.data)
   currentPage++
 }
 if (currentPage <= totalPage & result.success) {
   await getBatches()
 }
 
   } 
await getBatches();
 console.log(batches)
 let haveToReturn = { props: {}};
 if (batches.error?.status == 401) {
   removeCookies('access_token', { req, res})
   haveToReturn = {
  redirect: {
    permanent: false,
    destination: "/login",
  },
  props:{},
}
 } else if (batches?.success == true){
   
  haveToReturn = { props: {data:{token: token,batchId:batch,subjectsId:subject,data:batches}}};
}
console.log(haveToReturn)
return haveToReturn
}


//https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1