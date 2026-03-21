// import React, { useEffect, useState } from "react";
// import { FaGlobe } from "react-icons/fa";

// const HeaderTop = () => {
//   const [language, setLanguage] = useState("");

//   useEffect(() => {
//     // ✅ Initialize Google Translate
//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,es,hi,fr,de", // ✅ Added Hindi, French, German
//           layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//         },
//         "google_translate_element"
//       );
//     };

//     // ✅ Add Google Translate script
//     const script = document.createElement("script");
//     script.id = "google-translate-script";
//     script.src =
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);

//     // ✅ Function to hide Google Translate banner and unwanted UI
//     const hideGoogleUI = () => {
//       const bannerIframe = document.querySelector(".goog-te-banner-frame");
//       if (bannerIframe) bannerIframe.style.display = "none";
//       document.body.style.top = "0px";
//     };

//     // ✅ Interval to detect language dropdown
//     const interval = setInterval(() => {
//       const selectEl = document.querySelector(".goog-te-combo");

//       if (selectEl) {
//         hideGoogleUI();

//         // Hide default "Select Language" text
//         selectEl.style.color = "transparent";
//         selectEl.style.background = "transparent";

//         // ✅ Listen to language change
//         selectEl.addEventListener("change", () => {
//           const selectedLang = selectEl.value;

//           if (selectedLang === "en") setLanguage("English");
//           else if (selectedLang === "es") setLanguage("Spanish");
//           else if (selectedLang === "hi") setLanguage("Hindi");
//           else if (selectedLang === "fr") setLanguage("French");
//           else if (selectedLang === "de") setLanguage("German");
//           else setLanguage("Language");
//         });

//         clearInterval(interval);
//       }
//     }, 100);

//     // ✅ Cleanup
//     return () => {
//       clearInterval(interval);
//       const scriptTag = document.getElementById("google-translate-script");
//       if (scriptTag) scriptTag.remove();
//     };
//   }, []);

//   // ✅ Open translate dropdown manually
//   const openTranslateDropdown = () => {
//     const selectEl = document.querySelector(".goog-te-combo");
//     if (selectEl) selectEl.click();
//   };

//   // ✅ Inline styles
//   const headerStyle = {
//     padding: "10px 20px",
//     background: "#121212", // dark background
//     display: "flex",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     color: "#fff",
//     position: "relative",
//   };

//   const buttonStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     background: "#d35400", // dark orange
//     color: "#fff",
//     border: "none",
//     padding: "6px 12px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: 600,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(227, 85, 22, 0.5)", // subtle glow
//   };

//   return (
//     <div style={headerStyle}>
//       <button
//         style={buttonStyle}
//         onClick={openTranslateDropdown}
//         onMouseEnter={(e) => (e.currentTarget.style.background = "#ff7f3c")}
//         onMouseLeave={(e) => (e.currentTarget.style.background = "#e35516")}
//       >
//         <FaGlobe style={{ fontSize: "18px" }} />
//         {language}
//       </button>

//       <div
//         id="google_translate_element"
//         style={{ display: "inline-block", marginLeft: "10px" }}
//       ></div>
//     </div>
//   );
// };

// export default HeaderTop;

import React, { useEffect, useState, useRef } from "react";
import { FaGlobe } from "react-icons/fa";

const HeaderTop = () => {
  const [language, setLanguage] = useState("Language");
  const initialized = useRef(false);

  useEffect(() => {
    // ⛔ Prevent multiple init
    if (initialized.current) return;
    initialized.current = true;

    // ✅ Google Translate init
    window.googleTranslateElementInit = () => {
      if (
        window.google &&
        window.google.translate &&
        !document.getElementById("google_translate_element")?.hasChildNodes()
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,hi,fr,de",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    // ✅ Load script only once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      const selectEl = document.querySelector(".goog-te-combo");

      if (selectEl) {
        document.body.style.top = "0px";

        // Hide default UI
        selectEl.style.color = "transparent";
        selectEl.style.background = "transparent";

        // ⛔ Remove old listener before adding new
        selectEl.onchange = null;

        selectEl.onchange = () => {
          const langMap = {
            en: "English",
            es: "Spanish",
            hi: "Hindi",
            fr: "French",
            de: "German",
          };

          setLanguage(langMap[selectEl.value] || "Language");
        };

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const openTranslateDropdown = () => {
    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) selectEl.focus();
  };

  return (
    <div
      style={{
        padding: "10px 20px",
        background: "#121212",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <button
        onClick={openTranslateDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#d35400",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <FaGlobe />
        {language}
      </button>

      <div id="google_translate_element" style={{ marginLeft: "10px" }} />
    </div>
  );
};

export default HeaderTop;

