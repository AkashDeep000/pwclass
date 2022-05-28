import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { uid } from 'uid';
import axios from "axios"

import {useState, useRef} from "react"

//import getDownLink from "../../../util/getDownLink"
import { getCookie, removeCookies } from 'cookies-next'
import styles from '../../../styles/Home.module.css'
import Header from '../../../components/Header'
import DownCard from '../../../components/DownCard'
export default function Home({data}) {
  
  
 console.log(data.data.data[0].videoDetails)
  return (
    <>
    <Header/>
    <div className="text-center w-full text-2xl font-bold text-slate-600 p-2 mt-4">Videos To Download</div>
    <div className="grid p-3 gap-6 shadow-2xl">
    {data.data.data.map((el, i) => (
    <div key={i} >

    <div className="rounded w-full p-2 bg-slate-100 grid place-items-center">
       <img className="w-full rounded aspect-video" src={el.videoDetails.image}/>
       <div className="rounded w-full pt-4 p-2 bg-slate-100 grid gap-4 grid-cols-[1fr_7rem] place-items-center">
    <p className="w-full text font-bold text-slate-600">{el.topic}</p>
    <DownCard text={el.videoDetails.downLink}/>
    </div>
    
    </div>
    

    </div>
    
  ))}
  </div>  
    </>
  )
}

export const getServerSideProps = async ({ req, res, params}) => {
  const { batch, subject, chapter } =  params
   const token = await getCookie('access_token', { req, res});
  console.log(params, token)
 
    let batches;
 let totalPage = 1;
 let currentPage = 1;
   const getBatches = async () => {
     const data = await fetch(`https://api.penpencil.xyz/v2/batches/${batch}/subject/${subject}/contents?page=${currentPage}&contentType=videos&tag=${chapter}`, { 
   method: 'get', 
   headers: new Headers({
     'Authorization': `Bearer ${token}`
   })
   })
 const result = await data.json()
 //console.log(result)
 if (result?.success == true) {
   
 if (currentPage === 1) {
   batches = result
   totalPage = (Math.ceil(result.paginate.totalCount / result.paginate.limit))
   currentPage++
 } else if (currentPage > 1) {
   batches.data.push(...result.data)
   currentPage++
 }
 if (currentPage <= totalPage) {
   await getBatches()
 }
 } else {
   batches = result
 }
   } 
await getBatches();

const getDownLink = async (url) => {
  console.log(url)
  const data = await axios({
  method: 'post',
  url: 'https://api.penpencil.xyz/v1/files/get-signed-cookie',
  data: {
    url: url,
  },
  headers: {'Content-Type':	'application/json',
'client-type':	'WEB',
'Authorization':	'Bearer bb5c90fc009708c497e9aa7535f10f0c0737e18e472db8540aee916d891df988',
'client-id':	'5eb393ee95fab7468a79d189',
'client-version':	'99',
'randomId':	'3da41478-2a67-4290-ad42-796180bc7017',
'Accept':	'application/json, text/plain, */*'}
  })
   
 const result = data.data
  console.log(result)
  return `${url.replace(".mpd",".m3u8")}${result.data}`
}

if (batches?.success) {
const total = batches.data.length
let completed = 0

await Promise.all(batches.data.map(async (el,i) => {
  const res = await getDownLink(el.videoDetails.videoUrl)
  batches.data[i].videoDetails.downLink = res
}));
/*
 function getDownLinkLoop(){
 batches.data.forEach((el,i) => {
 console.log(el.videoDetails.videoUrl)
  
  const res = getDownLink(el.videoDetails.videoUrl)
    batches.data[i].videoDetails.downLink = res
})
}

await getDownLinkLoop()
*/
}

 //console.log(batches.data[0].videoDetails)
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
  haveToReturn = { props: {data:{token: token,data:batches}}};
}
//console.log(haveToReturn)
return haveToReturn
}


//https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1