
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "@/lib/profileApi";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";

export default function ProfilePage() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { user, updateUser } = useAuthStore();
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                password: "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const payload: any = { name: profile.name };
            if (profile.password) payload.password = profile.password;
            await updateProfile(payload);
            updateUser({ name: profile.name });
            setMessage("Settings updated successfully");
            setProfile((prev) => ({ ...prev, password: "" }));
        } catch (err: any) {
            setMessage(err?.response?.data?.message || "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 md:p-8 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Account Profile</CardTitle>
                    <CardDescription>View and update your account details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                readOnly
                                disabled
                                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                                placeholder="Your email"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                Change Password
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                        {message && <div className={message.includes("success") ? "text-green-600 mt-2" : "text-red-600 mt-2"}>{message}</div>}
                    </form>
                    {/* Show all account data for all roles */}
                    {user && (
                        <div className="mt-8">
                            <h3 className="font-semibold mb-2">Account Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><span className="font-medium">Name:</span> {user.name}</div>
                                <div><span className="font-medium">Email:</span> {user.email}</div>
                                <div><span className="font-medium">Role:</span> {user.role}</div>
                                {user.studentId && <div><span className="font-medium">Student ID:</span> {user.studentId}</div>}
                                {user.department && <div><span className="font-medium">Department:</span> {user.department}</div>}
                                {user.semester && <div><span className="font-medium">Semester:</span> {user.semester}</div>}
                                {user.cgpa !== undefined && <div><span className="font-medium">CGPA:</span> {user.cgpa}</div>}
                                {user.teacherId && <div><span className="font-medium">Teacher ID:</span> {user.teacherId}</div>}
                                {user.designation && <div><span className="font-medium">Designation:</span> {user.designation}</div>}
                                {user.librarianId && <div><span className="font-medium">Librarian ID:</span> {user.librarianId}</div>}
                                {user.adminId && <div><span className="font-medium">Admin ID:</span> {user.adminId}</div>}
                                {user.permissions && <div><span className="font-medium">Permissions:</span> {user.permissions.join(", ")}</div>}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
}
