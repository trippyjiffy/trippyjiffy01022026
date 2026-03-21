import React from "react";
import { Link } from "react-router-dom";

import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import Mode from "../HomeCompontent/Mode";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { HelmetProvider } from "react-helmet-async";

const PageNotFound = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <ScrollToTop />
        <HeaderTop />
        <Header darkMode={darkMode} />
        
        <div style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:"70vh",
          flexDirection:"column",
          fontFamily:"Arial"
        }}>
          <h1 style={{fontSize:"72px", color:"#e84118"}}>404</h1>
          <p style={{fontSize:"18px"}}>Page not found!</p>
          <Link to="/" style={{
            padding:"10px 20px",
            background:"#273c75",
            color:"#fff",
            textDecoration:"none",
            borderRadius:"5px"
          }}>Go to Home</Link>
        </div>

        <Footer darkMode={darkMode} />
        <WhatsappButton />
        <Mode setDarkMode={setDarkMode} darkMode={darkMode} />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default PageNotFound;
