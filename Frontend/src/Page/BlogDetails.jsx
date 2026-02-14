import React, { useEffect, useState } from "react";
import Style from "../Style/BlogDetails.module.scss";
import Enquiry from "./Enquiry";
import axios from "axios";
import { useParams } from "react-router-dom";
import Disk from "../Img/disk.jpg";
import { renderBlocks } from "../utils/utils";

// ⭐ Helmet Import
import { Helmet } from "react-helmet-async";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs/get`);
        const foundBlog = res.data.find((b) => String(b.id) === String(id));
        setBlog(foundBlog || null);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id, baseURL]);

  // ⭐ First paragraph for meta description
  const getFirstParagraph = (paragraphs) => {
    try {
      let parsed = paragraphs;
      if (typeof paragraphs === "string") parsed = JSON.parse(paragraphs);

      if (!parsed?.blocks?.length) return "";
      const block = parsed.blocks.find((b) => b.type === "paragraph");
      return block?.data?.text || "";
    } catch {
      return "";
    }
  };

  // ⭐ Full image URL
  const getFullImageURL = (img) => {
    if (!img) return null;
    let finalUrl = img;

    if (!finalUrl.startsWith("http")) {
      finalUrl = finalUrl.replace(/^\/?uploads\//, "");
      finalUrl = `${baseURL}/api/uploads/${finalUrl}`;
    }
    return finalUrl;
  };

  // ⭐ Dynamic SEO Content
  const pageTitle = blog?.title || "Blog Details | TrippyJiffy";
  const pageDescription =
    getFirstParagraph(blog?.paragraphs) ||
    "Explore detailed travel stories, tips and guides on TrippyJiffy.";
  const pageImage = blog?.image ? getFullImageURL(blog.image) : Disk;
  const pageURL = `https://trippyjiffy.com/blog/${id}`;

  return (
    <>
  <Helmet>
  <title>{pageTitle}</title>

  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="travel blog, travel guide, tourism, trippyjiffy blog"
  />

  {/* ✅ CANONICAL URL */}
  <link rel="canonical" href={pageURL} />

  {/* 🔥 Open Graph Meta Tags */}
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content={pageImage} />
  <meta property="og:url" content={pageURL} />
  <meta property="og:type" content="article" />

  {/* 🔥 Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>


      <div className={Style.BlogDetails}>
        <div className={Style.BlogDetailsHome}>
          <img src={Disk} alt="Header" />
          <div className={Style.BlogDetailsHomeTitle}>
            <h1>{blog?.title || "Loading..."}</h1>
          </div>
        </div>

        <div className={Style.wrapper}>
          <div className={Style.BlogDetailsFlex}>
            <div className={Style.BlogDetailsFlexLeft}>
              {blog ? (
                <div className={Style.blogCard}>
                  {blog.image && (
                    <img
                      src={getFullImageURL(blog.image)}
                      alt={blog.title}
                      className={Style.blogImage}
                    />
                  )}

                  <h2>{blog.title}</h2>
                  <p>Date: {new Date(blog.date).toDateString()}</p>

                  <div className={Style.blogContent}>
                    {renderBlocks(blog.paragraphs)}
                  </div>
                </div>
              ) : (
                <p>Loading blog...</p>
              )}
            </div>

            <div className={Style.BlogDetailsFlexRight}>
              <Enquiry />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
