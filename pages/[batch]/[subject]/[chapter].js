import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { uid } from "uid";
import axios from "axios";
import { connectToDatabase } from "../../../util/mongodb";
import DateDiff from "date-diff";
import { useState, useRef } from "react";

//import getDownLink from "../../../util/getDownLink"
import { getCookie, setCookies, removeCookies } from "cookies-next";
import styles from "../../../styles/Home.module.css";
import Header from "../../../components/Header";
import DownCard from "../../../components/DownCard";

export default function Home({ data }) {
  const contentType = data.type;
  console.log();
  console.log(data.data.data[0].videoDetails);
  return (
    <>
      <Header />
      <div className="text-center w-full text-2xl font-bold text-slate-600 p-2 mt-4">
        {" "}
        Links for Download
      </div>
      <div className="grid grid-cols-2 bg-slate-100 shadow-md">
        {contentType == "videos" ? (
          <>
            <button className="text-sky-500 px-2 h-12 text-lg rounded-md bg-white">
              Lactures
            </button>

            <Link href={`${data.url}?type=dpp`}>
              <button className="text-sky-500 px-2 h-12 text-lg rounded-md">
                Dpps
              </button>
            </Link>
          </>
        ) : contentType == "DppVideos" ? (
          <>
            <Link href={data.url}>
              <button className="text-sky-500 px-2 h-12 text-lg rounded-md">
                Lactures
              </button>
            </Link>

            <button className="text-sky-500 px-2 h-12 text-lg rounded-md bg-white">
              Dpps
            </button>
          </>
        ) : null}
      </div>
      <div className="grid p-3 gap-6 shadow-2xl">
        {data.data.data.map((el, i) => (
          <div key={i}>
            <div className="rounded w-full p-2 bg-slate-100 grid place-items-center">
              <img
                className="w-full rounded aspect-video"
                src={el.videoDetails.image}
              />

              <div className="rounded w-full pt-4 p-2 bg-slate-100 grid gap-4 grid-cols-[1fr_7rem] place-items-center">
                <p className="w-full text font-bold text-slate-600">
                  {el.topic}
                </p>
                <div>
                  <div>Video Link</div>
                  <DownCard text={el.videoDetails.downLink} />
                  <br />
                  <div>Thumbnail Link</div>
                  <DownCard text={el.videoDetails.image} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getServerSideProps = async ({ req, res, params, query }) => {
  const { batch, subject, chapter } = params;
  console.log(query.type);
  let contentType = "videos";

  if (query.type == "dpp") {
    contentType = "DppVideos";
  }
  console.log(contentType);
  const token = await getCookie("access_token", { req, res });
  console.log(params, token);
  const number = await getCookie("number", { req, res });

  const isSubscribed = await getCookie("isSubscribed", { req, res });

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({
    number: number,
  });
  console.log(user);
  const curDate = new Date();
  const subDate = user.subDate ? user.subDate : new Date(1999);
  const diff = new DateDiff(curDate, subDate);

  const dateDiff = diff.days();
  const haveSub = dateDiff <= 28 ? true : false;
  if (!haveSub) {
    removeCookies("isSubscribed", { req, res });
  } else {
    setCookies("isSubscribed", true, { req, res });
  }
  let batches;
  let totalPage = 1;
  let currentPage = 1;
  const getBatches = async () => {
    const data = await fetch(
      `https://api.penpencil.xyz/v2/batches/${batch}/subject/${subject}/contents?page=${currentPage}&contentType=${contentType}&tag=${chapter}`,
      {
        method: "get",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const result = await data.json();
    //console.log(result)
    if (result?.success == true) {
      if (currentPage === 1) {
        batches = result;
        totalPage = Math.ceil(
          result.paginate.totalCount / result.paginate.limit
        );
        currentPage++;
      } else if (currentPage > 1) {
        batches.data.push(...result.data);
        currentPage++;
      }
      if (currentPage <= totalPage) {
        await getBatches();
      }
    } else {
      batches = result;
    }
  };
  await getBatches();

  const getDownLink = async (url) => {
    console.log(url);
    let modUrl = url;
    if (url.startsWith("none")) {
      modUrl = url.substring(4);
    }

    try {
      const data = await axios({
        method: "post",
        url: "https://api.penpencil.xyz/v1/files/get-signed-cookie",
        data: {
          url: modUrl,
        },
        headers: {
          "Content-Type": "application/json",
          "client-type": "WEB",
          Authorization:
            `Bearer ${token}`,
          "client-id": "5eb393ee95fab7468a79d189",
          "client-version": "99",
          randomId: "3da41478-2a67-4290-ad42-796180bc7017",
          Accept: "application/json, text/plain, */*",
        },
      });


    const result = data.data;
    console.log(result);
    return `${modUrl.replace(".mpd", ".m3u8")}${result.data}`;
    } catch (e) {
      console.log(e);
    }
  };

  if (batches?.success) {
    const total = batches.data.length;
    let completed = 0;

    await Promise.all(
      batches.data.map(async (el, i) => {
        if (haveSub) {
          const res = await getDownLink(el.videoDetails.videoUrl);
          batches.data[i].videoDetails.downLink = res;
        } else {
          if (i === 0) {
            const res = await getDownLink(el.videoDetails.videoUrl);
            batches.data[i].videoDetails.downLink = res;
          } else {
            batches.data[i].videoDetails.downLink = "locked";
          }
        }
      })
    );
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
  let haveToReturn = { props: {} };
  if (batches.error?.status == 401) {
    removeCookies("access_token", { req, res });
    removeCookies("number", { req, res });
    removeCookies("isSubscribed", { req, res });
    haveToReturn = {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else if (batches?.success == true) {
    haveToReturn = {
      props: {
        data: {
          token: token,
          data: batches,
          type: contentType,
          url: `/${batch}/${subject}/${chapter}`,
        },
      },
    };
  }
  //console.log(haveToReturn)
  return haveToReturn;
}; //https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1
//https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1
//https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1

//https://api.penpencil.xyz/v2/batches/60f6a98b89de6f0018a09add/subject/60f6a98ca6aac6001861c2e2/topics?page=1
