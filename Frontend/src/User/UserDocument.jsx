import React, { useState, useEffect } from "react";
import axios from "axios";
import Style from "./Dashboard/Style/UserDocument.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UserDocument = () => {
  const [token, setToken] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const fetchPDFs = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${baseURL}/api/user-documents/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPdfs(res.data.pdfs || []);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchPDFs();
  }, [token]);

  const handleUploadPDF = async () => {
    if (!pdfFile && !pdfText.trim())
      return alert("⚠️ Select PDF or enter text!");

    const formData = new FormData();
    if (pdfFile) formData.append("pdf", pdfFile);
    if (pdfText.trim()) formData.append("pdf_text", pdfText);

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/api/user-documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Uploaded Successfully!");
      setPdfFile(null);
      setPdfText("");
      fetchPDFs();
    } catch (err) {
      console.error("❌ Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(
        `${baseURL}/api/user-documents/download/${id}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileURL = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", name || "document.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("❌ Download Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await axios.delete(`${baseURL}/api/user-documents/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Deleted!");
      fetchPDFs();
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  return (
    <div className={Style.UserDocument}>
      <h2>📄 User Documents</h2>

      <div className={Style.uploadSection}>

        <div className={Style.inputGroup}>
          <label>Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </div>

        <div className={Style.inputGroup}>
          <label>Write Notes</label>
          <textarea
            placeholder="Write notes or description..."
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
          />
        </div>

        <button
          className={Style.uploadBtn}
          onClick={handleUploadPDF}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>

      </div>

      <div className={Style.pdfList}>
        {pdfs.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul>
            {pdfs.map((pdf) => (
              <li key={pdf.id}>
                <div className={Style.pdfItem}>
                  <strong>{pdf.pdf_name || "Text Entry"}</strong>
                  <small>{new Date(pdf.uploaded_at).toLocaleDateString()}</small>

                  {pdf.pdf_text && (
                    <p className={Style.pdfText}>📝 {pdf.pdf_text}</p>
                  )}
                </div>

                <div className={Style.pdfActions}>
                  {pdf.pdf_file && (
                    <button onClick={() => handleDownload(pdf.id, pdf.pdf_name)}>
                      Download
                    </button>
                  )}

                  <button
                    className={Style.deleteBtn}
                    onClick={() => handleDelete(pdf.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDocument;
