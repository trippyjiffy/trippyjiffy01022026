import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Style from "../Style/TourDetails.module.scss";
import Enquiry from "./Enquiry";
import { renderBlocks } from "../utils/utils";
import {
  FiInfo,
  FiCheckCircle,
  FiNavigation,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";
import { Link as ScrollLink } from "react-scroll";
import { HiLocationMarker } from "react-icons/hi";
import Brief from "../Img/Untitled.png";
import { Helmet } from "react-helmet-async"; // <-- ADDED

const CountryTourDetails = () => {
  const { asiastateId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromAsia = query.get("from") === "asia";

  const [tour, setTour] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [relatedTours, setRelatedTours] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);

  const safeRender = (data, fallback = "No data available.") => {
    if (!data) return <p>{fallback}</p>;
    try {
      return typeof data === "object" ? renderBlocks(data) : data;
    } catch {
      return <p>{fallback}</p>;
    }
  };

  const renderBlocksToText = (val) => {
    if (!val) return "";
    let parsed;
    try {
      parsed = typeof val === "string" ? JSON.parse(val) : val;
    } catch {
      return String(val);
    }
    if (!parsed.blocks) return "";
    return parsed.blocks
      .map((block) => {
        switch (block.type) {
          case "paragraph":
            return block.data.text;
          case "header":
            return `ðŸ‘‰ ${block.data.text}`;
          case "list":
            return block.data.items.map((item) => `â€¢ ${item}`).join("\n");
          case "quote":
            return `"${block.data.text}" â€” ${block.data.caption || ""}`;
          default:
            return block.data.text || "";
        }
      })
      .join("\n");
  };

  // build a short meta description (first ~160 chars) from description/faq/itinerary
  const buildMetaDescription = () => {
    const sources = [];
    if (tour?.description) sources.push(renderBlocksToText(tour.description));
    if (tour?.routing) sources.push(renderBlocksToText(tour.routing));
    if (faqs.length > 0) {
      const firstFaqText =
        renderBlocksToText(faqs[0].question) +
        " " +
        renderBlocksToText(faqs[0].answer);
      sources.push(firstFaqText);
    }
    const combined = sources.filter(Boolean).join(" ");
    if (!combined) {
      return "Explore this tour with TrippyJiffy â€” itinerary, inclusions, exclusions and more.";
    }
    // trim and keep first 150-160 chars, avoid cutting words
    const trimmed = combined.replace(/\s+/g, " ").trim();
    if (trimmed.length <= 160) return trimmed;
    const cut = trimmed.slice(0, 157);
    return cut.slice(0, cut.lastIndexOf(" ")) + "...";
  };

  const getSafeImage = (img) => {
    if (!img) return "https://via.placeholder.com/300x200?text=No+Image";
    return img.startsWith("http") ? img : `${baseURL}/api/uploads/${img}`;
  };

  useEffect(() => {
    if (fromAsia) {
      setLoading(false);
      setTour(null);
      setRelatedTours([]);
      return;
    }

    const fetchTour = async () => {
      try {
        const asiaRes = await axios.get(`${baseURL}/api/asiaState/get`);
        const asiaData = Array.isArray(asiaRes.data)
          ? asiaRes.data
          : asiaRes.data.data || [];

        let foundTour = asiaData.find(
          (t) => Number(t.id) === Number(asiastateId)
        );
        setImage(foundTour);

        const countryRes = await axios.get(`${baseURL}/api/country/get`);
        const countryData = Array.isArray(countryRes.data.data)
          ? countryRes.data.data
          : [];

        const filteredCountry = countryData.filter(
          (t) => Number(t.asiastate_id) === Number(asiastateId)
        );

        if (filteredCountry.length > 0) {
          foundTour = { ...foundTour, ...filteredCountry[0] };
        }

        if (foundTour) {
          const related = asiaData.filter(
            (t) => t?.asia_id === foundTour?.asia_id && t?.id !== foundTour?.id
          );
          setRelatedTours(related);
        } else {
          setRelatedTours([]);
        }

        setTour(foundTour || null);
      } catch (err) {
        console.error("Failed to fetch tour details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [asiastateId, baseURL, fromAsia]);

  useEffect(() => {
    if (!tour || fromAsia) return;
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/countrytoursfaq/get`);
        const filtered = Array.isArray(res.data)
          ? res.data.filter((faq) => Number(faq.tour_id) === Number(tour?.id))
          : [];
        setFaqs(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaqs();
  }, [tour, baseURL, fromAsia]);

  const safeTimelineRender = (jsonString) => {
    if (!jsonString) return <p>No routing available.</p>;
    try {
      const parsed =
        typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      if (!parsed.blocks || !parsed.blocks.length)
        return <p>No routing available.</p>;

      return parsed.blocks.map((block, index) => (
        <div key={index} className={Style.timelineItem}>
          <div className={Style.timelineLeft}>
            <span className={Style.day}>Day {index + 1}</span>
            <span className={Style.circle}></span>
          </div>
          <div className={Style.timelineContent}>
            <p>{block.data.text}</p>
          </div>
        </div>
      ));
    } catch {
      return <p>Invalid routing data</p>;
    }
  };

  if (loading) return <p>Loading tour details...</p>;
  if (fromAsia) return <p>No tour found for this state (Asia Mode).</p>;
  if (!tour) return <p>No tour found for this state.</p>;

  return (
    <div className={Style.TourDetails}>
      {/* DYNAMIC SEO */}
 <Helmet>
  <title>
    {tour?.state_name
      ? `${tour.state_name} â€” Tour Details & Itinerary | TrippyJiffy`
      : "Tour Details | TrippyJiffy"}
  </title>

  <meta name="description" content={buildMetaDescription()} />

  <meta
    name="keywords"
    content="tour, itinerary, inclusions, travel, TrippyJiffy"
  />

  <meta
    property="og:title"
    content={
      tour?.state_name
        ? `${tour.state_name} â€” Tour Details`
        : "Tour Details"
    }
  />

  <meta property="og:description" content={buildMetaDescription()} />

  {/* use main image if available */}
  <meta property="og:image" content={getSafeImage(image?.state_image)} />

  {/* ✅ CANONICAL URL (dynamic tour page) */}
  <link
    rel="canonical"
    href={window.location.href}
  />
</Helmet>


      <div className={Style.TourImages}>
        {image?.state_image ? (
          <div className={Style.TourItem}>
            <img
              src={getSafeImage(image.state_image)}
              alt={tour.state_name ?? "Tour Image"}
            />
            <div className={Style.TourDetailsNAme}>
              <h1>{image.state_name}</h1>
            </div>
          </div>
        ) : (
          <p>No image available.</p>
        )}
      </div>

      <div className={Style.TourDetailsInfoDisk}>
        <ul>
          <li>
            <ScrollLink to="tourInfo" smooth duration={500} offset={-130}>
              <FiInfo /> Tour Info
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="itinerary" smooth duration={500} offset={-130}>
              <FiNavigation /> Itinerary
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="inclusions" smooth duration={500} offset={-130}>
              <FiCheckCircle /> Inclusions
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="exclusions" smooth duration={500} offset={-130}>
              <FiXCircle /> Exclusions
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="supplemental" smooth duration={500} offset={-130}>
              <FiActivity /> Supplemental Activities
            </ScrollLink>
          </li>
        </ul>
      </div>

      <div className={Style.wrapper}>
        <div className={Style.TourDetailsFlex}>
          <div className={Style.TourDetailsFlexLeft}>
            <div className={Style.TourDetailsPage}>
              <div id="tourInfo" className={Style.Inclusions}>
                <h3>Tour Info</h3>
                {safeRender(tour.description, "No description available.")}
              </div>

              <div id="route" className={Style.Route}>
                <h3>Brief Itinerary</h3>
                <img src={Brief} alt="brief" />
                {tour.routing ? (
                  <div className={Style.timeline}>
                    {safeTimelineRender(tour.routing)}
                  </div>
                ) : (
                  <p>No routing available.</p>
                )}
              </div>

              <div id="itinerary" className={Style.Itinerary}>
                <h3>Itinerary</h3>
                {faqs.length > 0 ? (
                  <div className={Style.faqtimeline}>
                    <div className={Style.timelineline}></div>
                    <ul className={Style.faqlist}>
                      {faqs.map((faq) => {
                        const isOpen = openFaq === faq.id;
                        return (
                          <li
                            key={faq.id}
                            className={`${Style.faqitem} ${
                              isOpen ? Style.open : ""
                            }`}
                          >
                            <span className={Style.pin}>
                              <span
                                className={`${Style.pincircle} ${
                                  isOpen ? Style.active : ""
                                }`}
                              >
                                {isOpen ? (
                                  <HiLocationMarker />
                                ) : (
                                  <span className={Style.pindot}></span>
                                )}
                              </span>
                            </span>
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              aria-expanded={isOpen}
                              aria-controls={`faq-answer-${faq.id}`}
                              className={Style.faqbutton}
                            >
                              <div className={Style.faqheader}>
                                <h4>{renderBlocksToText(faq.question)}</h4>
                                <span
                                  className={`${Style.arrow} ${
                                    isOpen ? Style.rotate : ""
                                  }`}
                                >
                                  â–¼
                                </span>
                              </div>
                              <div
                                id={`faq-answer-${faq.id}`}
                                className={`${Style.faqanswer} ${
                                  isOpen ? Style.show : ""
                                }`}
                              >
                                <p>{renderBlocksToText(faq.answer)}</p>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <p>No Itinerary available for this tour.</p>
                )}
              </div>

              <div id="inclusions" className={Style.Inclusions}>
                <h3>Inclusions</h3>
                {safeRender(tour.inclusions, "No inclusions available.")}
              </div>

              <div id="exclusions" className={Style.Exclusions}>
                <h3>Exclusions</h3>
                {safeRender(tour.exclusions, "No exclusions available.")}
              </div>

              <div id="supplemental" className={Style.Supplemental}>
                <h3>Supplemental Activities</h3>
                {safeRender(
                  tour.supplimental_activities,
                  "No supplemental activities available."
                )}
              </div>
            </div>
          </div>

          {/* âœ… Right Sidebar */}
          <div className={Style.TourDetailsFlexRight}>
            <div className={Style.TourDetailsFlexRightEnquiry}>
              <Enquiry />
            </div>

            {/* âœ… Popular Tours â€“ current open tour excluded */}
            <div className={Style.TourDetailsFlexRightTours}>
              <h3>Recommended Tour</h3>
              {relatedTours.length > 0 ? (
                <div className={Style.TourList1}>
                  {relatedTours
                    .filter((t) => Number(t.id) !== Number(asiastateId)) // ðŸš« Exclude current tour dynamically
                    .map((t) => {
                      const safeStateName = t?.state_name || "Unknown State";
                      const safeImage = getSafeImage(t?.state_image);
                      return (
                        <div key={t.id} className={Style.TourItem1}>
                          <Link
                            to={`/country/${t.asia_id}/${
                              t.id
                            }/${safeStateName.replace(/\s+/g, "-")}`}
                          >
                            <img src={safeImage} alt={safeStateName} />
                            <p>{safeStateName}</p>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p>No popular tours found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CountryTourDetails);
