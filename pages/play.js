import Head from "next/head"
import { useState, useEffect } from "react"
import ReactPlayer from 'react-player'
import { Player } from 'video-react';


export default function Play() {
  
  const url = "https://d1d34p8vz63oiq.cloudfront.net/f5903a7a-bc3c-4ca1-84d8-d1e1432aeedb/master.m3u8?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWQzNHA4dno2M29pcS5jbG91ZGZyb250Lm5ldC9mNTkwM2E3YS1iYzNjLTRjYTEtODRkOC1kMWUxNDMyYWVlZGIvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY1Mzk0NjI5NX19fV19&Key-Pair-Id=APKAJBP3D6S2IU5JK4LQ&Signature=ivr8r-9vEjme8zfagRYS7WbHKdoSM84LB0Mb9Z2KPUiACojpHoVBnDkHCrW5hymnuK-in7x2MyDa-ERSuKB8c59KooDuopIfjl539AJoF00frNMBEZVXR8Q9twxwak18qBLg4Wj~fkuChEeaC4J17HiXza9pRERkdGNucOROhpF7BGmvEWAphQayz4~LPiEZw2CQk9vD55vLYDszdZDBd2VeQ~eIw5o511lff~hPbi~rWAOTv4Lfe53QRPClY1D2e4fhddTqYo8AlnpWEs~N-gu1DuukHNRkmWWnBzj1bPJEQ3k2QV1HK7I4axpUWB0nQWJ6FbKRl7OFNrJ7hcUaNw__"
  const [isSSR, setIsSSR] = useState(true);


useEffect(() => {
	setIsSSR(false);
}, []);

  return (
    <>
    <Head>
    <link
  rel="stylesheet"
  href="https://video-react.github.io/assets/video-react.css"
/></Head>
    {isSSR ?
    null :
<Player>
      <source src={url} />
    </Player>
    }
    </>
    )
  
}