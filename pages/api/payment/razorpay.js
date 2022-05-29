// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { uid } from "uid"
import Razorpay from 'razorpay'

import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === 'POST') {
  const payment_capture = 1
	const amount = 199
	const currency = 'INR'
	
const razorpay = new Razorpay({
	key_id: 'rzp_test_dhlZTnBnAibhF6',
	key_secret: 'V088sC8GxHmOjwdv9K3VLkIn'
})
	const options = {
		amount: amount * 100,
		currency,
		receipt: uid(16),
		notes: {number: req.body.number},
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		
		 try {
		   const { db } = await connectToDatabase(); 
		 console.log("number: " + req.body.number)
       await db.collection('payments')
         .insertOne({
           number: req.body.number,
           orderId:  response.id,
           amount: response.amount,
           currency: response.currency,
           startedAt: new Date(),
           payment: "pending",
         })
     //after storing order details sends ifo to client    
      res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
		
    } catch (e) {
       console.log(e)
         res.status(200).json({ success: false, error: e})
    }
		
		
	} catch (error) {
		console.log(error)
		res.status(200).json({ success: false, error: error})
	}
  }
}
