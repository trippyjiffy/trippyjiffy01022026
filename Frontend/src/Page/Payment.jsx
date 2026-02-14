import React, { useState } from "react";
import Style from "../Style/Payment.module.scss";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR"); // ✅ Default currency
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Handle Razorpay Payment
  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0)
      return alert("Enter a valid amount");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseFloat(amount), currency }),
        }
      );

      const order = await res.json();
      if (!order.id) return alert("Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount, // Already in paise
        currency: order.currency,
        name: "TrippyJiffy.com",
        description: "Booking Payment",
        order_id: order.id,
        handler: function (response) {
          setTransactionId(response.razorpay_payment_id);
          setShowDetailsForm(true);

          // ✅ Save payment success
          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/payment/payment-success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                status: "paid",
              }),
            }
          );
        },
        theme: { color: "#d9630c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  // ✅ Handle Manual Payment Details Submission
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (
      !transactionId ||
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone
    )
      return alert("Fill all fields");

    const formData = new FormData();
    formData.append("name", userDetails.name);
    formData.append("email", userDetails.email);
    formData.append("phone", userDetails.phone);
    formData.append("transactionId", transactionId);
    formData.append("currency", currency); // ✅ Save currency in DB
    if (screenshot) formData.append("screenshot", screenshot);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/payment-details`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Details submitted successfully!");
        setShowDetailsForm(false);
        setAmount("");
        setTransactionId("");
        setScreenshot(null);
        setUserDetails({ name: "", email: "", phone: "" });
        setCurrency("INR"); // reset to default
      } else alert(data.message || "Submission failed");
    } catch (error) {
      console.error(error);
      alert("Error submitting details");
    }
  };

  return (
    <div className={Style.PaymentWrapper}>
      <h2>Pay with Razorpay</h2>
      {!showDetailsForm ? (
        <div className={Style.PaymentInput}>
        <select
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  style={{
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "coral",
    color: "white",
    marginBottom: "10px",
    outline: "none",
    cursor: "pointer"
  }}
>
  <option value="INR">Pay in ₹ INR</option>
  <option value="USD">Pay in $ USD</option>
</select>


          <input
            type="number"
            placeholder={`Enter amount (${currency === "INR" ? "₹" : "$"})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handlePayment} className={Style.payButton}>
            Pay Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleDetailsSubmit} className={Style.PaymentDisk}>
          <h3>Payment Details</h3>
          <p className={Style.transaction}>Transaction ID: {transactionId}</p>
          <p className={Style.currency}>Currency: {currency}</p>

          <input
            type="text"
            placeholder="Your Name"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={userDetails.phone}
            onChange={(e) =>
              setUserDetails({ ...userDetails, phone: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
          />
          <button type="submit" className={Style.payButton}>
            Submit Details
          </button>
        </form>
      )}
    </div>
  );
};

export default Payment;
