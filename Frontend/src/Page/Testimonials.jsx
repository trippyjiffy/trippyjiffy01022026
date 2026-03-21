import React, { useEffect, useState, memo } from "react";
import Style from "../Style/Testimonials.module.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleReviews from "../HomeCompontent/GoogleReviews.jsx";

const TestimonialCard = memo(({ item, baseURL, positionClass }) => {
  const photoURL =
    item?.photo && typeof item.photo === "string"
      ? item.photo.startsWith("http")
        ? item.photo
        : `${baseURL}/api/${item.photo}`
      : "https://via.placeholder.com/100";

  return (
    <div className={`${Style.card} ${Style[positionClass]}`}>
      <img
        src={photoURL}
        alt={item?.name || "Anonymous"}
        loading="lazy"
        decoding="async"
      />
      <div className={Style.cardContent}>
        <h2>{item?.name || "Anonymous"}</h2>

        {item?.origin && (
          <h5 style={{ fontSize: "15px", fontWeight: "500" }}>{item.origin}</h5>
        )}

        {item?.destination && (
          <h4 style={{ fontSize: "15px", fontWeight: "500" }}>
            {item.destination}
          </h4>
        )}

        <p>{item?.review || "No review available"}</p>

        <h3>{"⭐".repeat(item?.rating || 0)}</h3>
      </div>
    </div>
  );
});

const Testimonials = ({ darkMode }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  // ------------------------------
  // Fetch Data
  // ------------------------------
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/feedback/get`);
        setTestimonials(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    if (baseURL) fetchTestimonials();
  }, [baseURL]);

  // ------------------------------
  // Manual Carousel Navigation
  // ------------------------------
  const updateCarousel = (newIndex) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const index = (newIndex + testimonials.length) % testimonials.length;
    setCurrentIndex(index);

    setTimeout(() => setIsAnimating(false), 600);
  };

  // ------------------------------
  // Card Position Logic
  // ------------------------------
  const getCardClass = (i) => {
    const offset =
      (i - currentIndex + testimonials.length) % testimonials.length;

    if (offset === 0) return "center";
    if (offset === 1) return "right1";
    if (offset === 2) return "right2";
    if (offset === testimonials.length - 1) return "left1";
    if (offset === testimonials.length - 2) return "left2";

    return "hidden";
  };

  return (
    <div className={`${Style.Testimonials} ${darkMode ? Style.dark : ""}`}>
      <h2 className={Style.aboutTitle}>
        CUSTOMER’S <span>VALUABLE FEEDBACKS</span>
      </h2>

      {/* Carousel Section */}
      <div className={Style.carouselContainer}>
        <button
          className={`${Style.navArrow} ${Style.left}`}
          onClick={() => updateCarousel(currentIndex - 1)}
        >
          ‹
        </button>

        <div className={Style.carouselTrack}>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className={Style.skeletonCard}></div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((item, index) => (
              <TestimonialCard
                key={item.id || item._id || index}
                item={item}
                baseURL={baseURL}
                positionClass={getCardClass(index)}
              />
            ))
          ) : (
            <p>No testimonials available</p>
          )}
        </div>

        <button
          className={`${Style.navArrow} ${Style.right}`}
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </button>
      </div>

      {/* Member Info */}
      <div className={Style.memberInfo}>
        {testimonials[currentIndex] && (
          <>
            <h2 className={Style.memberName}>
              {testimonials[currentIndex].name}
            </h2>
            <p className={Style.memberRole}>
              {testimonials[currentIndex].origin || "Customer"}
            </p>
          </>
        )}
      </div>

      {/* Dots */}
      <div className={Style.dots}>
        {testimonials.map((_, i) => (
          <div
            key={i}
            className={`${Style.dot} ${i === currentIndex ? Style.active : ""}`}
            onClick={() => updateCarousel(i)}
          ></div>
        ))}
      </div>

      <div className={Style.TestimonialsUser1}>
        <Link to="/feedback-form">Submit Your Review</Link>
      </div>
       <div className={Style.GoogleReviewsContainer}>
        <GoogleReviews />
      </div>
      
    </div>
    




 



  );
};

export default Testimonials;
