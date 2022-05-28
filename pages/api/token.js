
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
   res.status(200).json({
     success: true,
     data: otpRes.data.data
   })
 } else {
  res.status(200).json({ success: false })
}
} catch (e) {
  console.log("error")
  //console.log(e)
  res.status(200).json({ success: false })
}

}