import React, { useState } from "react";
import Style from "../Style/FeedbackForm.module.scss";
import axios from "axios";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    review: "",
    destination: "",
    origin: "",
  });
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("rating", formData.rating);
      data.append("review", formData.review);
      data.append("destination", formData.destination);
      data.append("origin", formData.origin);
      if (photo) {
        data.append("photo", photo);
      }

      const res = await axios.post(`${baseURL}/api/feedback/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Feedback submitted successfully ✅");

      setFormData({
        name: "",
        rating: "",
        review: "",
        destination: "",
        origin: "",
      });
      setPhoto(null);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div className={Style.FeedbackForm}>
      <div className={Style.wrapper}>
        <div className={Style.FeedbackFormDisk}>
          <h1>Submit Your Feedback</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={Style.FeedbackFormInput}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={Style.FeedbackFormInput}>
            <label>Origin:</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Origin"
            />
          </div>
          <div className={Style.FeedbackFormInput}>
            <label>Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.FeedbackFormInput}>
            <label>Photo:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="preview"
                style={{
                  width: "100px",
                  height: "70px",
                  marginTop: "5px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <div className={Style.FeedbackFormInput}>
            <label>Rating (1-5):</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className={Style.FeedbackFormInput}>
            <label>Review:</label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default FeedbackForm;
