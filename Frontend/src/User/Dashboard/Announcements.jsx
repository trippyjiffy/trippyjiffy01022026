

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Style from "../Dashboard/Style/Announcements.module.scss";
// import Payment from "../../Page/Payment";

// const Announcements = () => {
//   const [message, setMessage] = useState("");
//   const [pdfs, setPdfs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showPayment, setShowPayment] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const baseURL = import.meta.env.VITE_API_BASE_URL;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchUserDataAndPDFs = async () => {
//       try {
//         if (!token) {
//           setError("User not logged in");
//           setLoading(false);
//           return;
//         }

//         // Get current user info
//         const userRes = await axios.get(`${baseURL}/api/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const user = userRes.data;
//         setUserId(user.id);
//         setMessage(user.admin_message || "No message from admin");

//         // Fetch PDFs for this user
//         const pdfRes = await axios.get(
//           `${baseURL}/api/user-documents/user/${user.id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setPdfs(pdfRes.data.pdfs || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError(err.response?.data?.message || "Error fetching data");
//         setLoading(false);
//       }
//     };

//     fetchUserDataAndPDFs();
//   }, []);

//   const handleDownloadPDF = async (pdfId, pdfName) => {
//     try {
//       const res = await axios.get(`${baseURL}/api/user-documents/download/${pdfId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", pdfName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download Error:", err);
//       alert("Failed to download PDF ❌");
//     }
//   };

//   if (loading) return <p className={Style.loading}>Loading...</p>;
//   if (error) return <p className={Style.error}>{error}</p>;

//   return (
//     <div className={Style.Announcements}>
//       <h2>📢 Announcements</h2>

//       <div className={Style.AnnouncementsDisk}>
//         <p className={Style.adminMsg}>{message}</p>

//         {/* ✅ PDF Section */}
//         <div className={Style.pdfSection}>
//           <h3>📂 Your Documents</h3>
//           {pdfs.length > 0 ? (
//             <ul className={Style.pdfList}>
//               {pdfs.map((pdf) => (
//                 <li key={pdf.id} className={Style.pdfItem}>
//                   <div className={Style.pdfHeader}>
//                     <strong>{pdf.pdf_name}</strong>
//                     <span className={Style.date}>
//                       {new Date(pdf.uploaded_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                   {pdf.pdf_text && (
//                     <div className={Style.pdfText}>
//                       <em>Preview:</em> {pdf.pdf_text.slice(0, 200)}...
//                     </div>
//                   )}
//                   <button
//                     className={Style.downloadBtn}
//                     onClick={() => handleDownloadPDF(pdf.id, pdf.pdf_name)}
//                   >
//                     ⬇ Download
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className={Style.noPdf}>No PDFs available</p>
//           )}
//         </div>

//         <div className={Style.centerBtn}>
//           <button onClick={() => setShowPayment(true)} className={Style.payBtn}>
//             💳 Pay Now
//           </button>
//         </div>
//       </div>

//       {/* ✅ Payment Modal */}
//       {showPayment && (
//         <div className={Style.overlay}>
//           <div className={Style.modal}>
//             <button className={Style.closeBtn} onClick={() => setShowPayment(false)}>
//               ✖
//             </button>
//             <Payment />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Announcements;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Dashboard/Style/Announcements.module.scss";
import Payment from "../../Page/Payment";

const Announcements = () => {
  const [message, setMessage] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [userId, setUserId] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        if (!token) throw new Error("User not logged in");

        const userRes = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(userRes.data.id);
        setMessage(userRes.data.admin_message || "No message from admin");

        const pdfRes = await axios.get(
          `${baseURL}/api/user-documents/user/${userRes.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPdfs(pdfRes.data.pdfs || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);


const handleDownload = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/user-documents/download/${id}`,
      {
        responseType: "blob", // Important for binary data
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `user_document_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("❌ Download failed:", err);
  }
};

  const handleDeletePDF = async (pdfId) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await axios.delete(`${baseURL}/api/user-documents/delete/${pdfId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== pdfId));
    } catch (err) {
      alert("❌ Delete failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (loading) return <p className={Style.loading}>Loading...</p>;
  if (error) return <p className={Style.error}>{error}</p>;

  return (
    <div className={Style.Announcements}>
      <h2>📢 Announcements</h2>
      <div className={Style.AnnouncementsDisk}>
        <p className={Style.adminMsg}>{message}</p>

        <div className={Style.pdfSection}>
          <h3>📂 Your Documents</h3>
          {pdfs.length ? (
            <ul className={Style.pdfList}>
              {pdfs.map((pdf) => (
                <li key={pdf.id} className={Style.pdfItem}>
                  <div className={Style.pdfHeader}>
                    <strong>Document {pdf.id}</strong>
                    <span>{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
                  </div>
                  <div className={Style.btnGroup}>
                    <button
                      onClick={() => handleDownloadPDF(pdf.id)}
                      className={Style.downloadBtn}
                    >
                      ⬇ Download
                    </button>
                    <button
                      onClick={() => handleDeletePDF(pdf.id)}
                      className={Style.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No PDFs available</p>
          )}
        </div>

        <div className={Style.centerBtn}>
          <button onClick={() => setShowPayment(true)} className={Style.payBtn}>
            💳 Pay Now
          </button>
        </div>
      </div>

      {showPayment && (
        <div className={Style.overlay}>
          <div className={Style.modal}>
            <button onClick={() => setShowPayment(false)} className={Style.closeBtn}>
              ✖
            </button>
            <Payment />
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;

