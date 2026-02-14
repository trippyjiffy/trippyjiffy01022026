import { useOutletContext } from "react-router-dom";
import Banner from "./HomeCompontent/Banner";
import Destinations from "./HomeCompontent/Destinations";
import Blog from "./HomeCompontent/Blog";
import Testimonials from "./Page/Testimonials";
import Choose from "./HomeCompontent/Choose";
// ----------------- HELMET -----------------
import { Helmet } from "react-helmet-async";

const Homepage = () => {
  const { darkMode } = useOutletContext();

  // Dynamic meta info for Homepage
  const metaTitle = "Explore Amazing Tours & Destinations — TrippyJiffy Travel";
  const metaDescription =
    "Discover exciting tours, travel destinations, blogs, and testimonials with TrippyJiffy Travel. Start your adventure today!";

  console.log("Homepage darkMode:", darkMode);

  return (
    <div>
      {/* ---------- DYNAMIC HELMET ---------- */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Banner />
      <Destinations darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <Blog darkMode={darkMode} />
      <Choose darkMode={darkMode} />
    </div>
  );
};

export default Homepage;
