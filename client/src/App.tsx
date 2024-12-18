import { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";


import dotenv from 'dotenv';
dotenv.config();

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY || '');

type FetchClientSecret = () => Promise<string>;

const CheckoutForm = () => {
  const fetchClientSecret = useCallback<FetchClientSecret>(() => {
    //Create a checkout session
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
       stripe={stripePromise}
       options={options} 
       >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/checkout-session?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
        We appreciate your business! A confirmation email will be sent to {customerEmail}.

        If you have any questions, please email <a href="mailto:rosa.angel.daniel@gmail.com">rosa.angel.daniel@gmail.com</a>.
        </p>
      </section>
    )
  }

  return null;
}

const App = () => {
  return (
   <div className="App">
    <Router>
     <Routes>
       <Route path="/checkout" element={<CheckoutForm />} />
       <Route path="/return" element={<Return />} />
     </Routes>
    </Router>
   </div>
  );
};

export default App;