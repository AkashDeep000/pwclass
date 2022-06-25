import Stripe from 'stripe';
import { uid } from 'uid'
const stripe = new Stripe('sk_test_51L54UBSEULUuExpIoSSgcvqgq5PD4323C0eyDOIZCLxg2cNJJrCR8CYK9RP1nso8P2jWaNd4wXDhoCsfKT7S6EyX00HBKFZXbO');

export default async function handler(req, res) {
  const price = 100
  const idempontencyKey = uid(16)

try {

  const paymentIntents = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntents)
res.status(200).json({clientSecret: paymentIntents.client_secret})
 
} catch (e) {
  console.log(e)
}   
  
  
   
}