import React, { useEffect, useState } from "react";
import { fetchFellowships, updateFellowship, deleteFellowship } from "./fellowshipApi";
import { Fellowship } from "./fellowshipTypes";


const FellowshipAdminManager: React.FC = () => {
    const [fellowships, setFellowships] = useState<Fellowship[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Fellowship | null>(null);
    const [editForm, setEditForm] = useState<Partial<Fellowship> | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchFellowships()
            .then((data) => {
                setFellowships(data.fellowships);
                setError(null);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || "Failed to fetch fellowships");
            })
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const handleEdit = (fellowship: Fellowship) => {
        setSelected(fellowship);
        setEditForm({ ...fellowship });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev!, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected || !editForm) return;
        setEditLoading(true);
        try {
            await updateFellowship(selected._id, editForm);
            setSelected(null);
            setEditForm(null);
            setRefreshKey((k) => k + 1);
        } catch (err) {
            alert("Failed to update fellowship");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (fellowship: Fellowship) => {
        if (window.confirm(`Delete fellowship '${fellowship.name}'?`)) {
            try {
                await deleteFellowship(fellowship._id);
                setRefreshKey((k) => k + 1);
            } catch (err) {
                alert("Failed to delete fellowship");
            }
        }
    };

    return (
        <div
            style={{
                maxWidth: 1000,
                margin: "2rem auto",
                padding: "clamp(16px, 4vw, 32px)",
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 24px #0002",
                width: "95vw",
                minWidth: 0,
                border: "1.5px solid #e6e8f0",
            }}
        >
            <h2
                style={{
                    fontSize: "clamp(22px, 5vw, 30px)",
                    fontWeight: 900,
                    marginBottom: 32,
                    textAlign: "center",
                    letterSpacing: 1,
                    color: "#1a237e",
                    textShadow: "0 2px 8px #e3e6f9"
                }}
            >
                All Programs
            </h2>
            {loading ? (
                <div style={{ textAlign: "center", fontSize: 18, color: "#888" }}>Loading fellowships...</div>
            ) : error ? (
                <div style={{ color: "#d32f2f", textAlign: "center", fontWeight: 600 }}>{error}</div>
            ) : fellowships.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888", fontSize: 18, padding: 32 }}>No fellowships found.</div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: 0,
                            background: "#fafbfc",
                            borderRadius: 12,
                            boxShadow: "0 1px 4px #0001",
                            minWidth: 600,
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#f5f7fa", position: "sticky", top: 0, zIndex: 2 }}>
                                <th style={{ padding: "clamp(8px, 2vw, 14px)", borderBottom: "2px solid #e0e0e0", fontWeight: 700, fontSize: 15, position: "sticky", left: 0, background: "#f5f7fa" }}>Name</th>
                                <th style={{ padding: "clamp(8px, 2vw, 14px)", borderBottom: "2px solid #e0e0e0", fontWeight: 700, fontSize: 15 }}>Category</th>
                                <th style={{ padding: "clamp(8px, 2vw, 14px)", borderBottom: "2px solid #e0e0e0", fontWeight: 700, fontSize: 15 }}>Status</th>
                                <th style={{ padding: "clamp(8px, 2vw, 14px)", borderBottom: "2px solid #e0e0e0", fontWeight: 700, fontSize: 15 }}>Deadline</th>
                                <th style={{ padding: "clamp(8px, 2vw, 14px)", borderBottom: "2px solid #e0e0e0", fontWeight: 700, fontSize: 15 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fellowships.map((f, idx) => (
                                <tr
                                    key={f._id}
                                    style={{
                                        background: idx % 2 === 0 ? "#fff" : "#f7fafd",
                                        transition: "background 0.2s",
                                        cursor: "pointer",
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.background = "#e3e8fd")}
                                    onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f7fafd")}
                                >
                                    <td style={{ padding: "clamp(6px, 1.5vw, 12px)", borderBottom: "1px solid #f0f0f0", wordBreak: "break-word", fontWeight: 600 }}>{f.name}</td>
                                    <td style={{ padding: "clamp(6px, 1.5vw, 12px)", borderBottom: "1px solid #f0f0f0", wordBreak: "break-word" }}>{f.category}</td>
                                    <td style={{ padding: "clamp(6px, 1.5vw, 12px)", borderBottom: "1px solid #f0f0f0", wordBreak: "break-word" }}>{f.status}</td>
                                    <td style={{ padding: "clamp(6px, 1.5vw, 12px)", borderBottom: "1px solid #f0f0f0", wordBreak: "break-word" }}>{new Date(f.applicationDeadline).toLocaleDateString()}</td>
                                    <td style={{ padding: "clamp(6px, 1.5vw, 12px)", borderBottom: "1px solid #f0f0f0" }}>
                                        <button
                                            onClick={() => handleEdit(f)}
                                            style={{
                                                marginRight: 8,
                                                background: "linear-gradient(90deg,#1976d2 60%,#3f51b5 100%)",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "7px 18px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                fontSize: "clamp(13px, 2vw, 15px)",
                                                boxShadow: "0 2px 8px #1976d222",
                                                transition: "background 0.2s, box-shadow 0.2s",
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f)}
                                            style={{
                                                background: "#fff",
                                                color: "#d32f2f",
                                                border: "1.5px solid #d32f2f",
                                                borderRadius: 6,
                                                padding: "7px 18px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                fontSize: "clamp(13px, 2vw, 15px)",
                                                boxShadow: "0 2px 8px #d32f2f11",
                                                transition: "background 0.2s, box-shadow 0.2s",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {selected && editForm && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "clamp(8px, 4vw, 32px)",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "min(420px, 98vw)",
                            maxHeight: "98vh",
                            overflowY: "auto",
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 2px 16px #0003",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <form
                            onSubmit={handleEditSubmit}
                            style={{
                                padding: "clamp(12px, 4vw, 32px)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0,
                            }}
                        >
                            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>Edit Fellowship</h3>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontWeight: 500 }}>Name</label>
                                <input name="name" value={editForm.name || ""} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontWeight: 500 }}>Description</label>
                                <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontWeight: 500 }}>Eligibility</label>
                                <input name="eligibility" value={editForm.eligibility || ""} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                            </div>
                            <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <label style={{ fontWeight: 500 }}>Amount</label>
                                    <input name="amount" type="number" value={editForm.amount || 0} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <label style={{ fontWeight: 500 }}>Duration</label>
                                    <input name="duration" value={editForm.duration || ""} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontWeight: 500 }}>Deadline</label>
                                <input name="applicationDeadline" type="date" value={editForm.applicationDeadline?.slice(0, 10) || ""} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontWeight: 500 }}>Required Documents</label>
                                <input name="requiredDocuments" value={Array.isArray(editForm.requiredDocuments) ? editForm.requiredDocuments.join(",") : ""} onChange={e => setEditForm(f => ({ ...f!, requiredDocuments: e.target.value.split(",").map(s => s.trim()) }))} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }} />
                            </div>
                            <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <label style={{ fontWeight: 500 }}>Category</label>
                                    <select name="category" value={editForm.category || "merit"} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }}>
                                        <option value="merit">Merit</option>
                                        <option value="need-based">Need-based</option>
                                        <option value="research">Research</option>
                                        <option value="sports">Sports</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <label style={{ fontWeight: 500 }}>Status</label>
                                    <select name="status" value={editForm.status || "active"} onChange={handleEditChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginTop: 4, fontSize: "clamp(14px, 2vw, 16px)" }}>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
                                <button type="submit" disabled={editLoading} style={{ flex: 1, background: "#1976d2", color: "#fff", padding: 12, borderRadius: 6, border: "none", fontWeight: 700, fontSize: "clamp(15px, 2vw, 16px)", cursor: editLoading ? "not-allowed" : "pointer" }}>
                                    {editLoading ? "Saving..." : "Save"}
                                </button>
                                <button type="button" onClick={() => { setSelected(null); setEditForm(null); }} style={{ flex: 1, background: "#eee", color: "#333", padding: 12, borderRadius: 6, border: "none", fontWeight: 700, fontSize: "clamp(15px, 2vw, 16px)" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* TODO: Add application review UI */}
        </div>
    );
};

export default FellowshipAdminManager;
