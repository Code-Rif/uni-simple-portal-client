import React, { useState } from "react";
import { Fellowship } from "./fellowshipTypes";
import { createFellowship } from "./fellowshipApi";

const defaultFellowship: Partial<Fellowship> = {
    name: "",
    description: "",
    eligibility: "",
    amount: 0,
    duration: "",
    applicationDeadline: "",
    requiredDocuments: [],
    category: "merit",
    status: "active",
};

const FellowshipAdminCreate: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
    const [form, setForm] = useState<Partial<Fellowship>>(defaultFellowship);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        try {
            await createFellowship(form);
            setForm(defaultFellowship);
            setSuccess(true);
            if (onCreated) onCreated();
        } catch (err: unknown) {
            // Type guard for Axios error
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response === "object" &&
                (err as { response?: { data?: { message?: string } } }).response?.data?.message
            ) {
                setError((err as { response: { data: { message: string } } }).response.data.message);
            } else {
                setError("Failed to create fellowship");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: 520,
            margin: "2rem auto",
            padding: 28,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            background: "#fafbfc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Add Fellowship</h2>
            <div style={{ marginBottom: 14 }}>
                <label htmlFor="name" style={{ fontWeight: 500 }}>Name *</label>
                <input id="name" name="name" value={form.name || ""} onChange={handleChange} placeholder="e.g. National Merit Fellowship" required style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label htmlFor="description" style={{ fontWeight: 500 }}>Description *</label>
                <textarea id="description" name="description" value={form.description || ""} onChange={handleChange} placeholder="Describe the fellowship..." required rows={3} style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label htmlFor="eligibility" style={{ fontWeight: 500 }}>Eligibility *</label>
                <input id="eligibility" name="eligibility" value={form.eligibility || ""} onChange={handleChange} placeholder="Eligibility criteria" required style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
            </div>
            <div style={{ marginBottom: 14, display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="amount" style={{ fontWeight: 500 }}>Amount *</label>
                    <input id="amount" name="amount" type="number" min={0} value={form.amount || 0} onChange={handleChange} placeholder="e.g. 5000" required style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="duration" style={{ fontWeight: 500 }}>Duration *</label>
                    <input id="duration" name="duration" value={form.duration || ""} onChange={handleChange} placeholder="e.g. 1 year" required style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label htmlFor="applicationDeadline" style={{ fontWeight: 500 }}>Application Deadline *</label>
                <input id="applicationDeadline" name="applicationDeadline" type="date" value={form.applicationDeadline?.slice(0, 10) || ""} onChange={handleChange} required style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
                <small style={{ color: "#888" }}>Applicants cannot apply after this date.</small>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label htmlFor="requiredDocuments" style={{ fontWeight: 500 }}>Required Documents</label>
                <input id="requiredDocuments" name="requiredDocuments" value={form.requiredDocuments?.join(",") || ""} onChange={e => setForm(f => ({ ...f, requiredDocuments: e.target.value.split(",").map(s => s.trim()) }))} placeholder="e.g. Transcript, ID Card (comma separated)" style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
                <small style={{ color: "#888" }}>Separate multiple documents with commas.</small>
            </div>
            <div style={{ marginBottom: 14, display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="category" style={{ fontWeight: 500 }}>Category *</label>
                    <select id="category" name="category" value={form.category || "merit"} onChange={handleChange} style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}>
                        <option value="merit">Merit</option>
                        <option value="need-based">Need-based</option>
                        <option value="research">Research</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="status" style={{ fontWeight: 500 }}>Status *</label>
                    <select id="status" name="status" value={form.status || "active"} onChange={handleChange} style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            <button type="submit" disabled={submitting} style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 4, background: "#1976d2", color: "#fff", fontWeight: 600, border: "none", fontSize: 16, cursor: submitting ? "not-allowed" : "pointer" }}>
                {submitting ? "Adding..." : "Add Fellowship"}
            </button>
            {error && <div style={{ color: "#d32f2f", marginTop: 12, textAlign: "center" }}>{error}</div>}
            {success && <div style={{ color: "#388e3c", marginTop: 12, textAlign: "center" }}>Fellowship created!</div>}
        </form>
    );
};

export default FellowshipAdminCreate;
