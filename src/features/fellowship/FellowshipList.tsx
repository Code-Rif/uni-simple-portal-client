import React, { useEffect, useState } from "react";
import { fetchFellowships } from "./fellowshipApi";
import { Fellowship, FellowshipCategory, FellowshipStatus } from "./fellowshipTypes";
import FellowshipApply from "./FellowshipApply";
import ReactDOM from "react-dom";
import toast from "@/lib/sonner";

const FellowshipList: React.FC = () => {
    const [fellowships, setFellowships] = useState<Fellowship[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [applyingId, setApplyingId] = useState<string | null>(null);
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

    if (loading) return <div>Loading fellowships...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    // Filter: show active, upcoming, and recently closed (within 7 days) fellowships
    const now = new Date();
    const filteredFellowships = fellowships.filter((fellowship) => {
        if (fellowship.status === "active" || fellowship.status === "upcoming") return true;
        if (fellowship.status === "closed") {
            const deadline = new Date(fellowship.applicationDeadline);
            const diffDays = (now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7; // closed within last 7 days
        }
        return false;
    });

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Available Fellowships</h2>
            {filteredFellowships.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">No fellowships found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFellowships.map((fellowship) => (
                        <div key={fellowship._id} className="bg-card rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-semibold text-foreground">{fellowship.name}</span>
                                    <span className="px-2 py-1 rounded text-xs bg-primary-100 text-primary font-medium">{fellowship.category}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                                    <span>Status: <span className="font-semibold text-foreground">{fellowship.status}</span></span>
                                    <span>Deadline: <span className="font-semibold">{new Date(fellowship.applicationDeadline).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm mb-2">
                                    <span>Amount: <span className="font-semibold">${fellowship.amount}</span></span>
                                    <span>Slots: <span className="font-semibold">{fellowship.totalSlots ?? "N/A"}</span></span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {fellowship.description?.slice(0, 120)}{fellowship.description?.length > 120 ? "..." : ""}
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => setApplyingId(fellowship._id)}
                                    className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for FellowshipApply */}
            {applyingId && (
                ReactDOM.createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
                        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in flex flex-col" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                            <button
                                onClick={() => setApplyingId(null)}
                                className="absolute top-3 right-3 text-2xl text-muted-foreground hover:text-error focus:outline-none"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <div className="p-6 pt-10 flex-1 flex flex-col justify-between">
                                <h3 className="text-xl font-bold mb-4 text-primary text-center">Apply for Fellowship</h3>
                                <FellowshipApply
                                    fellowshipId={applyingId}
                                    improvedUi={true}
                                    onSuccess={() => {
                                        toast.success("Application submitted successfully!");
                                        setApplyingId(null);
                                        setRefreshKey((k) => k + 1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            )}
        </div>
    );
};

export default FellowshipList;
