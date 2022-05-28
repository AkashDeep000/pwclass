   import {CopyToClipboard} from 'react-copy-to-clipboard';
   import {useState, useRef} from "react"


   export default function DownCard(text) {
 const [isCopy, setIsCopy] = useState(false)
  console.log(text.text)
  return (
   
     <CopyToClipboard text={text.text}
    onCopy={() => setIsCopy(true)}>
  <button className="bg-white w-full text-sky-400 p-2 text-xl rounded">
  {!isCopy ? "Copy Link" : "Copied"}
  </button>
</CopyToClipboard>
    
    )}