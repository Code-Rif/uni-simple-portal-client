import React, { useEffect, useState } from "react";
import { fetchFellowshipById } from "./fellowshipApi";
import { Fellowship } from "./fellowshipTypes";

interface FellowshipDetailProps {
    fellowshipId: string;
}

const FellowshipDetail: React.FC<FellowshipDetailProps> = ({ fellowshipId }) => {
    const [fellowship, setFellowship] = useState<Fellowship | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchFellowshipById(fellowshipId)
            .then((data) => {
                setFellowship(data);
                setError(null);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || "Failed to fetch fellowship details");
            })
            .finally(() => setLoading(false));
    }, [fellowshipId]);

    if (loading) return <div>Loading fellowship details...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!fellowship) return <div>No fellowship found.</div>;

    return (
        <div>
            <h2>{fellowship.name}</h2>
            <p><strong>Category:</strong> {fellowship.category}</p>
            <p><strong>Status:</strong> {fellowship.status}</p>
            <p><strong>Amount:</strong> {fellowship.amount}</p>
            <p><strong>Duration:</strong> {fellowship.duration}</p>
            <p><strong>Deadline:</strong> {new Date(fellowship.applicationDeadline).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {fellowship.description}</p>
            <p><strong>Eligibility:</strong> {fellowship.eligibility}</p>
            <p><strong>Required Documents:</strong> {fellowship.requiredDocuments?.join(", ") || "None"}</p>
            <p><strong>Created By:</strong> {fellowship.createdBy?.name}</p>
            <p><strong>Last Updated By:</strong> {fellowship.lastUpdatedBy?.name || "N/A"}</p>
            <p><strong>Slots:</strong> {fellowship.totalSlots ?? "N/A"}</p>
            <p><strong>Application Count:</strong> {fellowship.applicationCount ?? 0}</p>
            <p><strong>Days Remaining:</strong> {fellowship.daysRemaining ?? "N/A"}</p>
        </div>
    );
};

export default FellowshipDetail;
