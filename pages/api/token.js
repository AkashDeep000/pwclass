import { connectToDatabase } from "../../util/mongodb";
import DateDiff from "date-diff"
import axios from "axios"

export default async function handler(req, res) {
  
const number = await req.body.number
const otp = await req.body.otp
console.log(number, otp)
try {
  const otpRes = await axios({
      method: 'post',
  url: "https://api.penpencil.xyz/v1/oauth/token",
  data: {"username":number,"otp":otp,"client_id":"system-admin","client_secret":"KjPXuAVfC5xbmgreETNMaL7z","grant_type":"password","organizationId":"5eb393ee95fab7468a79d189","latitude":0,"longitude":0}
,
  headers: {'Content-Type':	'application/json',
'client-type':	'WEB',
'client-id':	'5eb393ee95fab7468a79d189',
'client-version':	'99',
'randomId':	'3da41478-2a67-4290-ad42-796180bc7017',
'Accept':	'application/json, text/plain, */*'}
    })
  console.log(otpRes.data)
 if (otpRes.data.success) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users')
         .findOne({
           number: number
         })
    console.log(user)
  if (user) {
    
   const curDate = new Date()
   const subDate = user.subDate ? user.subDate : new Date(1999)
    const diff = new DateDiff(curDate, subDate);
    
    const dateDiff = diff.days()
    console.log(dateDiff)
    if (dateDiff <= 28) {
      res.status(200).json({
     success: true,
     data: {
       access_token: otpRes.data.data.access_token,
       number: number,
       isSubscribed: true,
     }
   })
    } else {
      res.status(200).json({
     success: true,
     data: {
       access_token: otpRes.data.data.access_token,
       number: number,
       isSubscribed: false,
     }
   })
    }
    
    /*
    try {
    await db.collection('users')
    .updateOne({_id:user._id}, {$set:{
      subDate: new Date()
    }});
    } catch (e) {
      console.log(e)
    }
    */
    
  } else {
    try {
       await db.collection('users')
         .insertOne({
           number: number,
           firstName: otpRes.data.data.user.firstName,
           lastName: otpRes.data.data.user.lastName,
          email: otpRes.data.data.user.email,
           subDate: new Date("1999"),
         })
      res.status(200).json({
     success: true,
     data: {
       access_token: otpRes.data.data.access_token,
       number: number,
       isSubscribed: false,
     }
   })   
         
    } catch (e) {
       console.log(e)
         res.status(200).json({ success: false, error: e})
    }
  }
   
 } else {
  res.status(200).json({ success: false })
}
} catch (e) {
  console.log(e)
  //console.log(e)
  res.status(200).json({ success: false, error:e})
}

}