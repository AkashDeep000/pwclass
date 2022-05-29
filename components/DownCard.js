   import {CopyToClipboard} from 'react-copy-to-clipboard';
   import {useState, useRef} from "react"
import Link from "next/link"
import { BiLock } from "react-icons/bi";
   export default function DownCard(text) {
  const link = text.text
 const [isCopy, setIsCopy] = useState(false)
  console.log(text.text)
  if (link !== "locked") {
    return (

     <CopyToClipboard text={text.text}
    onCopy={() => setIsCopy(true)}>
  <button className="bg-white w-full text-sky-400 p-2 text-xl rounded shadow-[0_0_.6rem_rgb(93,126,141,0.1)]">
  {!isCopy ? "Copy Link" : "Copied"}
  </button>
</CopyToClipboard>
      )
  } else {
    
  return (
    <Link href="/subscribe">
  <button className="bg-white w-full text-sky-400 p-2 text-xl rounded shadow-[0_0_.6rem_rgb(93,126,141,0.1)">
  Unlock   <BiLock className="text-sky-400 inline w-8 h-8"/>
  </button>
  </Link>
  )}
    }