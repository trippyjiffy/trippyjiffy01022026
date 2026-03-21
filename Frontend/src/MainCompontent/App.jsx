import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import Mode from "../HomeCompontent/Mode";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <ScrollToTop />
        <HeaderTop />
        <Header darkMode={darkMode} />
        <Outlet context={{ darkMode, setDarkMode }} />
        <Footer darkMode={darkMode} />
        <WhatsappButton />
        <Mode setDarkMode={setDarkMode} darkMode={darkMode} />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;
