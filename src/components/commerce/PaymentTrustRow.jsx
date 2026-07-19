import { memo } from "react";
import razorpayLogo from "../../assets/payment-logos/razorpay.svg";
import upiLogo from "../../assets/payment-logos/upi.svg";
import googlePayLogo from "../../assets/payment-logos/google-pay.svg";
import phonePeLogo from "../../assets/payment-logos/phonepe.svg";
import paytmLogo from "../../assets/payment-logos/paytm.svg";
import visaLogo from "../../assets/payment-logos/visa.svg";
import mastercardLogo from "../../assets/payment-logos/mastercard.svg";
import rupayLogo from "../../assets/payment-logos/rupay.svg";

const LOGOS = [
  { src: razorpayLogo, alt: "Razorpay" },
  { src: upiLogo, alt: "UPI" },
  { src: googlePayLogo, alt: "Google Pay" },
  { src: phonePeLogo, alt: "PhonePe" },
  { src: paytmLogo, alt: "Paytm" },
  { src: visaLogo, alt: "Visa" },
  { src: mastercardLogo, alt: "Mastercard" },
  { src: rupayLogo, alt: "RuPay" },
];

const PaymentTrustRow = memo(() => (
  <div className="bp-payment-trust" aria-label="Payment methods available through Razorpay">
    <div className="bp-payment-trust__label">Payment methods available through Razorpay</div>
    <div className="bp-payment-trust__logos">
      {LOGOS.map((logo) => (
        <span className="bp-payment-logo" key={logo.alt}>
          <img src={logo.src} alt={logo.alt} loading="lazy" />
        </span>
      ))}
    </div>
    <p>Your payment is processed by Razorpay in its secure checkout window.</p>
  </div>
));

export default PaymentTrustRow;

