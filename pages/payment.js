import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import axios from "axios"
import {useState, useRef} from "react"
import { setCookies } from 'cookies-next'
import { useRouter } from 'next/router'


import styles from '../styles/Home.module.css'
import Header from '../components/Header'
export default function Payment() {
  
  
  
  return (
    <>
    <Header/>
    <div className="bg-white rounded shadow-sm m-2">
    <h2 className="text-slate-500 text-center text-xl font-bold p-4"> 
    Your Total Available Fund
    </h2>
    <div className="bg-slate-100 rounded text-center p-8">
        <span className="rounded text-sky-500  text-8xl font-bold p-4"> 
     ₹100
    </span>
    </div>
    </div>
    <div className="bg-white rounded shadow-sm m-2">
    <h2 className="text-slate-500 text-center text-xl font-bold p-4"> 
    Add Fund
    </h2>
    <div className="bg-slate-100 rounded text-center p-8">
        <span className="rounded text-sky-500  text-8xl font-bold p-4"> 
     ₹100
    </span>
    </div>
    </div>
     </>
  )
}
