import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Style from "../Style/State.module.scss";
import Enquiry from "./Enquiry";

const State = () => {
  const { stateId, stateName } = useParams();

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [stateData, setStateData] = useState(null);
  const [tourData, setTourData] = useState([]);
  const [categoryIndia, setCategoryIndia] = useState([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await axios.get(`${baseURL}/api/state/get`);
        let filteredStates = [];

        if (stateId) {
          filteredStates = stateRes.data.filter(
            (s) =>
              String(s.category_id) === String(stateId) ||
              String(s.id) === String(stateId)
          );
        } else if (stateName) {
          filteredStates = stateRes.data.filter(
            (s) =>
              s.state_name?.toLowerCase().replace(/\s+/g, "-") ===
              stateName.toLowerCase()
          );
        }

        setStatesList(filteredStates);
        setStateData(filteredStates[0] || null);

        const toursRes = await axios.get(`${baseURL}/api/tours/get`);
        setTourData(toursRes.data);

        const categoryRes = await axios.get(`${baseURL}/api/category-india/get`);
        setCategoryIndia(categoryRes.data || []);
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
      }
    };

    fetchData();
  }, [stateId, stateName, baseURL]);

  const slugify = (s = "") =>
    String(s).toLowerCase().trim().replace(/\s+/g, "-");

  const normalizeImages = (state) => {
    const img = state?.image_url || state?.image;

    if (!img) return ["https://placehold.co/200x150?text=No+Image"];

    if (Array.isArray(img)) {
      return img.map((i) =>
        String(i).startsWith("http")
          ? i
          : `${baseURL}/api/uploads/${String(i).replace(/^\//, "")}`
      );
    }

    if (typeof img === "string") {
      return [
        img.startsWith("http")
          ? img
          : `${baseURL}/api/uploads/${img.replace(/^\//, "")}`,
      ];
    }

    return ["https://placehold.co/200x150?text=No+Image"];
  };

  // SAFE PARSE FOR EDITORJS / RAW STRINGS
  const safeParse = (data) => {
    try {
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return {
            blocks: [
              {
                type: "paragraph",
                data: { text: data },
              },
            ],
          };
        }
      }
      if (typeof data === "object") return data;
      return null;
    } catch {
      return null;
    }
  };

  // HTML -> Plain Text (decode entities & keep line breaks)
  const htmlToPlainText = (html = "") => {
    if (!html && html !== "") return "";
    try {
      if (typeof window !== "undefined") {
        const doc = new DOMParser().parseFromString(String(html), "text/html");
        const walker = doc.body;

        walker.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));

        ["p", "div", "li", "section", "article", "h1", "h2", "h3", "h4"].forEach(
          (tag) => {
            walker.querySelectorAll(tag).forEach((el) => {
              el.insertAdjacentText("beforebegin", "\n");
              el.insertAdjacentText("afterend", "\n");
            });
          }
        );

        let text = walker.textContent || "";
        text = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
        return text.trim();
      }

      return String(html)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    } catch {
      return String(html)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }
  };

  const renderSection = (label, fieldData) => {
    const parsed = safeParse(fieldData);

    if (!parsed || !parsed.blocks || parsed.blocks.length === 0) {
      return <p style={{ color: "gray" }}>⚠ No {label} available</p>;
    }

    return (
      <div className={Style.SectionBox}>
        {parsed.blocks.map((block, i) => {
          if (!block || !block.type) return null;

          let raw = "";
          if (block.type === "paragraph") raw = block.data?.text ?? "";
          else if (block.type === "list") {
            const items = Array.isArray(block.data?.items)
              ? block.data.items.map((it) =>
                  typeof it === "string" ? it : it?.content || ""
                )
              : [];
            raw = items.join("\n");
          } else if (block.type === "header") raw = block.data?.text ?? "";
          else {
            raw =
              block.data?.text ||
              block.data?.content ||
              (typeof block === "string" ? block : JSON.stringify(block));
          }

          const text = htmlToPlainText(raw || "");
          const paras = text
            .split(/\n{2,}|\r\n\r\n/)
            .filter((p) => p.trim() !== "");

          return (
            <div key={i} style={{ marginBottom: "0.75rem" }}>
              {paras.map((p, idx) => (
                <p
                  key={idx}
                  style={{
                    whiteSpace: "pre-wrap",
                    margin: "0 0 0.5rem 0",
                    lineHeight: 1.5,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const toursList = useMemo(() => {
    if (!statesList || statesList.length === 0)
      return <p>No states found for this category.</p>;

    return statesList.map((state) => {
      const relatedTours = (tourData || []).filter(
        (t) => String(t.state_id) === String(state.id)
      );

      return (
        <div key={state.id} className={Style.StateBlockFlex}>
          <div className={Style.StateBlockLeft}>
            {normalizeImages(state).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={state.state_name}
                width="200"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/200x150?text=No+Image";
                }}
              />
            ))}
          </div>

          <div className={Style.StateBlockRight}>
            <h1>{state.state_name}</h1>

            {relatedTours.map((tour) => (
              <div key={tour.id} className={Style.TourBox}>
                {tour.description ? (
                  renderSection("Description", tour.description)
                ) : (
                  <p style={{ color: "gray" }}>⚠ No Description available</p>
                )}

                <Link to={`/tour/${tour.id}`}>View Details</Link>
              </div>
            ))}

            {relatedTours.length === 0 && (
              <p style={{ color: "gray" }}>No tours available.</p>
            )}
          </div>
        </div>
      );
    });
  }, [statesList, tourData]);

  // ✅ bannerData stable (stateId OR stateName)
  const bannerData = useMemo(() => {
    if (stateId) {
      return categoryIndia.find((c) => String(c.id) === String(stateId)) || null;
    }
    if (stateName) {
      const sn = slugify(stateName);
      return (
        categoryIndia.find((c) => {
          const r1 = slugify(c.region_name || "");
          const r2 = slugify(c.state_name || "");
          const r3 = slugify(c.name || "");
          return r1 === sn || r2 === sn || r3 === sn;
        }) || null
      );
    }
    return null;
  }, [categoryIndia, stateId, stateName]);

  // ✅ IMPORTANT: image fallback to stateData (so it never becomes undefined)
  const bannerImgRaw =
    bannerData?.image ||
    bannerData?.image_url ||
    stateData?.image ||
    stateData?.image_url ||
    null;

  const bannerImageURL = bannerImgRaw
    ? String(bannerImgRaw).startsWith("http")
      ? bannerImgRaw
      : `${baseURL}/api/uploads/${String(bannerImgRaw).replace(/^\//, "")}`
    : "https://placehold.co/1200x400?text=No+Image";

  const bannerTitle =
    bannerData?.region_name || stateData?.state_name || stateName || "State";

  const formattedTitle = `${bannerTitle} Tours | TrippyJiffy`;

  // ✅ logs (optional)
  useEffect(() => {
    console.log("baseURL:", baseURL);
    console.log("bannerData.image:", bannerData?.image);
    console.log("bannerImgRaw:", bannerImgRaw);
    console.log("bannerImageURL:", bannerImageURL);
  }, [baseURL, bannerData, bannerImgRaw, bannerImageURL]);

  return (
    <>
   <Helmet>
  <title>{formattedTitle}</title>

  <meta
    name="description"
    content={`Explore best tours of ${bannerTitle} with TrippyJiffy.`}
  />

  {/* ✅ CANONICAL URL (dynamic) */}
  <link
    rel="canonical"
    href={window.location.href}
  />
</Helmet>


      <div className={`${Style.StatePage} ${showEnquiry ? Style.blurred : ""}`}>
        <div className={Style.StateImage}>
          <img
            src={bannerImageURL}
            alt={bannerTitle}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/1200x400?text=No+Image";
            }}
          />

          <div className={Style.StateText}>
            <h2>
              <center>{bannerTitle}</center>
            </h2>
          </div>
        </div>

        <div className={Style.wrapper}>
          <div className={Style.StateFlex}>
            <div className={Style.StateFlexLeft}>
              <div className={Style.StateFlexLeftBox}>{toursList}</div>
            </div>

            <div className={Style.StateFlexRight}>
              <Enquiry />
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default React.memo(State);
