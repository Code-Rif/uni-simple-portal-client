import React, { useState } from "react";
import { changePassword } from "@/lib/profileApi";

export default function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await changePassword({ oldPassword, newPassword });
            setSuccess("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Wrong old password or error updating password");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                    </div>
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                    {success && <div className="text-green-600 mt-2">{success}</div>}
                </form>
            </div>
        </div>
    );
}
