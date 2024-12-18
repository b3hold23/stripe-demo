import Stripe from "stripe";
import 'dotenv/config';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: '2024-11-20.acacia',
});
const cust = await stripe.customers.list();
console.log(cust);
//# sourceMappingURL=server.js.map