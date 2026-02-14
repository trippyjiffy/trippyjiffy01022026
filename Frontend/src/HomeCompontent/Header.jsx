import React, { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Style from "../Style/Header.module.scss";
import logo from "../Img/trippylogo.png";
import Enquiry from "../Page/Enquiry";
import DropDown from "../HomeCompontent/DropDown.jsx";
import axios from "axios";

const Header = ({ darkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [indiaTours, setIndiaTours] = useState([]);
  const [asiaTours, setAsiaTours] = useState([]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const fetchIndiaTours = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/category-india/get`);
        const formatted = res.data.map((item) => ({
          id: item.id,
          name: item.region_name,
          path: `/india-tours/${item.region_name
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        }));
        setIndiaTours(formatted);
      } catch (error) {
        console.error("Error fetching India Tours:", error);
      }
    };
    fetchIndiaTours();
  }, [baseURL]);
  useEffect(() => {
    const fetchAsiaTours = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/asia/get`);
        const formatted = res.data.map((item) => ({
          id: item.id,
          name: item.country_name,
          path: `/asia-tours/${item.country_name
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          images: item.images || [],
        }));
        setAsiaTours(formatted);
      } catch (error) {
        console.error("Error fetching Asia Tours:", error);
      }
    };
    fetchAsiaTours();
  }, [baseURL]);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setActive(scrolled > 100);

      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navData = [
    { name: "Home", path: "/" },
    { name: "India Tours", categories: indiaTours },
    { name: "Asia Tours", categories: asiaTours },
    {
      name: "Reach Us",
      categories: [
        { name: "Business With Us", path: "/business-with-us" },
        { name: "Contact us", path: "/contact-us" },
      ],
    },
    { name: "About Us", path: "/about-us" },
    { name: "Blogs", path: "/blogpage" },
  ];

  return (
    <>
      <header
        className={`${Style.Header} ${darkMode ? Style.dark : ""} ${
          active ? Style.active : ""
        }`}
      >
        <div className={Style.wrapper}>
          <div className={Style.HeaderFlex}>
            <div className={Style.HeaderLeft}>
              <Link to="/">
                <img src={logo} alt="Trippy Travels Logo"   />
              </Link>
            </div>

            <div className={Style.HeaderRight}>
              <DropDown
                darkMode={darkMode}
                navData={navData}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
              />

              <div>
                <button
                  className={Style.PlanTripBtn}
                  onClick={() => setShowEnquiry(true)}
                >
                  Plan Your Trip
                </button>
                {showEnquiry && (
                  <div className={Style.modalOverlay}>
                    <div className={Style.modalContent}>
                      <button
                        className={Style.closeBtn}
                        onClick={() => setShowEnquiry(false)}
                      >
                        X
                      </button>
                      <Enquiry />
                    </div>
                  </div>
                )}
              </div>

              <div className={Style.Payment}>
                <Link to="/payment">Pay Now</Link>
              </div>
              <div className={Style.Payment}>
                <Link to="/shop">Shop With Us</Link>
              </div>

              <div className={Style.HeaderUser}>
              <Link to="/register" aria-label="Register">
  <FaUserCircle size={28} aria-hidden="true" />
</Link>

              </div>
            </div>

            <div
              className={`${Style.Headertoggle} ${menuOpen ? Style.open : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div
          className={Style.scrollBar}
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </header>

      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
};

export default memo(Header);
