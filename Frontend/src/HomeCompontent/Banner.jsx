import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Style from "../Style/Banner.module.scss";
import Banner1 from "../Img/Banner!.webp";
import Banner2 from "../Img/Banner2 (2).webp";
import Banner3 from "../Img/Banner32.webp";

const Banner = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 500);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/combined-data`);
        setCombinedData(res.data || []);
        console.log("Merged API Data:", res.data);
      } catch (err) {
        console.error(
          "Error fetching combined data:",
          err.response || err.message
        );
      }
    };
    fetchData();
  }, [baseURL]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = combinedData.filter((item) => {
      const name = item.state_name || item.country_name || "";
      return name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });

    setFilteredResults(filtered);
    setShowDropdown(true);
  }, [debouncedSearch, combinedData]);

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSelectItem = (item) => {
    const name = item.state_name || item.country_name;
    setSearchTerm(name);
    setShowDropdown(false);

    const slug = slugify(name);
    if (item.state_name) {
      navigate(`/india-tours/state/${item.id}/${slug}`);
    } else {
      navigate(`/asia-tours/${slug}`);
    }
  };

  return (
    <div className={Style.Banner}>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        loop={true}
        effect="fade"
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        speed={2000}
        className={Style.swiperContainer}
        navigation={false}
      >
        <SwiperSlide>
          <div className={Style.slide}>
            <img
              src={Banner1}
              alt="banner-1"
              className={Style.bannerImage}
              loading="eager"
            />
            <div className={Style.overlay}></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={Style.slide}>
            <img
              src={Banner2}
              alt="banner-2"
              className={Style.bannerImage}
              loading="lazy"
            />
            <div className={Style.overlay}></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={Style.slide}>
            <img
              src={Banner3}
              alt="banner-3"
              className={Style.bannerImage}
              loading="lazy"
            />
            <div className={Style.overlay}></div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className={Style.wrapper}>
        <div className={Style.Bannertext}>
          <h1>
            TrippyJiffy: Unlock India’s 4th Dimension of Travel and Discovery
          </h1>
          <h2>
            TrippyJiffy invites you to step into the 4th Dimension of
            Travel where the magic of India unfolds like never before
          </h2>
          <div className={Style.searchBox}>
            <input
              type="text"
              placeholder="Find your Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.trim() !== "") setShowDropdown(true);
              }}
            />

            {showDropdown && filteredResults.length > 0 && (
              <div className={Style.searchResults}>
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className={Style.searchItem}
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.state_name || item.country_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

