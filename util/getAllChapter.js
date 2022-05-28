import axios from "axios"

export default function ({batchId,subjectId,token}) {
  const res = await axios({
  method: 'get',
  url: `https://api.penpencil.xyz/v2/batches/${batchId}/subject/${subjectId}/topics?page=1`, 
  headers: {'Content-Type':	'application/json',
'client-type':	'WEB',
'Authorization':	token,
'client-id':	'5eb393ee95fab7468a79d189',
'client-version':	'99',
'randomId':	'3da41478-2a67-4290-ad42-796180bc7017',
'Accept':	'application/json, text/plain, */*'}
})

}