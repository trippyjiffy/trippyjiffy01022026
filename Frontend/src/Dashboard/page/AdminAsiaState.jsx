import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Style/AdminAsiaState.module.scss";

const AdminAsiaState = () => {
  const [states, setStates] = useState([]);
  const [asiaList, setAsiaList] = useState([]);
  const [form, setForm] = useState({
    state_name: "",
    state_image: null,
    asia_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const baseIMG = import.meta.env.VITE_API_BASE_URL_IMG;

  // ✅ SAFE STATES FETCH
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asiaState/get`);
      console.log("States API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setStates(data);
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([]);
    }
  };

  // ✅ SAFE ASIA FETCH
  const fetchAsiaList = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asia/get`);
      console.log("Asia API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setAsiaList(data);
    } catch (err) {
      console.error("Error fetching asia list:", err);
      setAsiaList([]);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchAsiaList();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, state_image: file });
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const openAddModal = () => {
    setForm({ state_name: "", state_image: null, asia_id: "" });
    setPreview("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (state) => {
    setForm({
      state_name: state.state_name,
      state_image: null,
      asia_id: state.asia_id,
    });
    setPreview(state.state_image ? `${baseIMG}${state.state_image}` : "");
    setEditingId(state.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("state_name", form.state_name);
      formData.append("asia_id", form.asia_id);
      if (form.state_image) formData.append("state_image", form.state_image);

      if (editingId) {
        await axios.put(
          `${baseURL}/api/asiaState/update/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ State updated");
      } else {
        await axios.post(`${baseURL}/api/asiaState/post`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ State added");
      }

      setShowModal(false);
      setEditingId(null);
      fetchStates();
    } catch (err) {
      console.error("Error saving state:", err);
      alert(err.response?.data?.message || "Error saving state");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/asiaState/delete/${id}`);
      fetchStates();
      alert("🗑️ Deleted");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={Style.AdminAsiaState}>
      <h2>🌏 Asia State Management</h2>

      <button className={Style.addBtn} onClick={openAddModal}>
        + Add State
      </button>

      <table className={Style.stateTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Asia</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(states) && states.length > 0 ? (
            states.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.state_name}</td>

                <td>
                  {s.state_image && (
                    <img
                      src={`${baseIMG}${s.state_image}`}
                      alt={s.state_name}
                      className={Style.stateImg}
                    />
                  )}
                </td>

                <td>
                  {Array.isArray(asiaList)
                    ? asiaList.find(
                        (a) => String(a.id) === String(s.asia_id)
                      )?.country_name || "Unknown"
                    : "Unknown"}
                </td>

                <td>
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Data</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={Style.modalOverlay}>
          <div className={Style.modalBox}>
            <h3>{editingId ? "Edit State" : "Add State"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="state_name"
                value={form.state_name}
                onChange={handleChange}
                placeholder="State Name"
                required
              />

              <input type="file" onChange={handleFileChange} />

              <select
                name="asia_id"
                value={form.asia_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Asia</option>
                {Array.isArray(asiaList) &&
                  asiaList.map((asia) => (
                    <option key={asia.id} value={asia.id}>
                      {asia.country_name}
                    </option>
                  ))}
              </select>

              {preview && <img src={preview} className={Style.previewImg} />}

              <button type="submit">
                {editingId ? "Update" : "Add"}
              </button>

              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAsiaState;
