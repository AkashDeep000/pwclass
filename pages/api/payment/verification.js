import crypto from "crypto";
import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
if (req.method === 'POST') {
// do a validation
	const secret = '@hsakA321#'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')
 
	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		const { db } = await connectToDatabase(); 
try {
//  console.log(req.body.payload.payment.entity)
    const payment = await db.collection('payments')
         .findOne({
           orderId: req.body.payload.payment.entity.order_id
         })
    console.log(payment)
    const userUpdate = db.collection('users')
    .updateOne({number: payment.number}, {$set:{
      subDate: new Date()
    }});
    
    const paymentUpdate = db.collection('payments')
    .updateOne({orderId:req.body.payload.payment.entity.order_id}, {$set:{
      payment: "successfull",
      endedOn: new Date(),
      rezorpayPayload: req.body
    }});
    
    await Promise.all([userUpdate, paymentUpdate]).then(() => {
      console.log(paymentUpdate, userUpdate)
      res.json({ status: 'ok' })
    })
    
} catch (e) {
  console.log(e)
}
    
    
    }	else {
		// pass it
		 return res.status(404).json()
    }
	}

	
 else return res.status(404).json()
}