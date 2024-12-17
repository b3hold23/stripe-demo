import Stripe from "stripe";

const stripe = new Stripe("sk_test_51QWjzuCTJLN1aJlJ5pIdwpS2TGPofcA28o579terTOj9VMkHka4h5XzaJYjxKyCqyR5h2atA8viKVFBKTqjWuPrH00dbJzw5id");  

const customer = await stripe.customers.list({
});
console.log(customer);