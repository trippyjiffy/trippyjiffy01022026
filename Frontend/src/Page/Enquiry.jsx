import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "../Style/Enquiry.module.scss";
import axios from "axios";

const Enquiry = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    arrival_date: "",
    departure_date: "",
    hotel_category: "",
    no_of_adults: 1,
    no_of_children: 0,
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      origin: "",
      destination: "",
      arrival_date: "",
      departure_date: "",
      hotel_category: "",
      no_of_adults: 1,
      no_of_children: 0,
      message: "",
    });
  };

  const postPublic = async () => {
    return axios.post(`${baseURL}/api/enquiry/post`, formData);
  };

  const postAuth = async (token) => {
    return axios.post(`${baseURL}/api/enquiry/post-auth`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      let res;

      // ✅ try auth only if token exists
      if (token) {
        try {
          res = await postAuth(token);
        } catch (err) {
          // ✅ If token invalid/expired => fallback to public
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            res = await postPublic();
          } else {
            throw err;
          }
        }
      } else {
        res = await postPublic();
      }

      const msg = res?.data?.message || "Enquiry submitted successfully";
      setSuccessMsg(msg);
      resetForm();

      // ✅ redirect after success
      navigate("/thankyou");
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.Enquiry}>
      <div className={Style.wrapper}>
        {/* optional: heading remove if landing already has heading */}
        <div className={Style.EnquiryForm}>
          <h1>Travel Enquiry Form</h1>
        </div>

        {successMsg && <p className={Style.success}>{successMsg}</p>}
        {errorMsg && <p className={Style.error}>{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className={Style.EnquiryInBox}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.EnquiryInBox}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.EnquiryInBox}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.EnquiryInBoxFlex}>
            <div className={Style.EnquiryInBox1}>
              <label>Origin</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.EnquiryInBox1}>
              <label>Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={Style.EnquiryInBoxFlex}>
            <div className={Style.EnquiryInBox1}>
              <label>Arrival Date</label>
              <input
                type="date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.EnquiryInBox1}>
              <label>Departure Date</label>
              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={Style.EnquiryInBoxSelect}>
            <label>Hotel Category</label>
            <select
              name="hotel_category"
              value={formData.hotel_category}
              onChange={handleChange}
              required
            >
              <option value="">Select Hotel Category</option>
              <option value="3 Star">3 Star</option>
              <option value="4 Star">4 Star</option>
              <option value="5 Star">5 Star</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div className={Style.EnquiryInBoxFlex}>
            <div className={Style.EnquiryInBox1}>
              <label>No of Adults</label>
              <input
                type="number"
                name="no_of_adults"
                min="1"
                value={formData.no_of_adults}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.EnquiryInBox1}>
              <label>No of Children</label>
              <input
                type="number"
                name="no_of_children"
                min="0"
                value={formData.no_of_children}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Style.EnquiryInBoxtext}>
            <label>Message If Any</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;
