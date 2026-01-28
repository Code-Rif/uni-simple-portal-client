
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
        department: user?.department || "",
        semester: user?.semester || "",
        session: user?.session || "",
        cgpa: user?.cgpa || "",
        teacherId: user?.teacherId || "",
        designation: user?.designation || "",
        librarianId: user?.librarianId || "",
        adminId: user?.adminId || "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                password: "",
                department: user.department || "",
                semester: user.semester || "",
                session: user.session || "",
                cgpa: user.cgpa || "",
                teacherId: user.teacherId || "",
                designation: user.designation || "",
                librarianId: user.librarianId || "",
                adminId: user.adminId || "",
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
                        <table className="min-w-full border text-sm">
                            <tbody>
                                <tr>
                                    <td className="p-2 border font-medium">Name</td>
                                    <td className="p-2 border"><input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></td>
                                </tr>
                                <tr>
                                    <td className="p-2 border font-medium">Email</td>
                                    <td className="p-2 border"><input type="email" name="email" value={profile.email} readOnly disabled className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" required /></td>
                                </tr>
                                {user?.role === "student" && (
                                    <>
                                        <tr>
                                            <td className="p-2 border font-medium">Student ID</td>
                                            <td className="p-2 border"><input type="text" name="studentId" value={user.studentId || ""} readOnly disabled className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 border font-medium">Department</td>
                                            <td className="p-2 border"><input type="text" name="department" value={profile.department} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 border font-medium">Semester</td>
                                            <td className="p-2 border"><input type="text" name="semester" value={profile.semester} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 border font-medium">Session</td>
                                            <td className="p-2 border"><input type="text" name="session" value={profile.session} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 border font-medium">CGPA</td>
                                            <td className="p-2 border"><input type="text" name="cgpa" value={profile.cgpa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                    </>
                                )}
                                {user?.role === "teacher" && (
                                    <>
                                        <tr>
                                            <td className="p-2 border font-medium">Teacher ID</td>
                                            <td className="p-2 border"><input type="text" name="teacherId" value={profile.teacherId} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 border font-medium">Designation</td>
                                            <td className="p-2 border"><input type="text" name="designation" value={profile.designation} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                        </tr>
                                    </>
                                )}
                                {user?.role === "librarian" && (
                                    <tr>
                                        <td className="p-2 border font-medium">Librarian ID</td>
                                        <td className="p-2 border"><input type="text" name="librarianId" value={profile.librarianId} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                    </tr>
                                )}
                                {user?.role === "admin" && (
                                    <tr>
                                        <td className="p-2 border font-medium">Admin ID</td>
                                        <td className="p-2 border"><input type="text" name="adminId" value={profile.adminId} onChange={handleChange} className="w-full border rounded px-3 py-2" /></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex gap-2 mt-4">
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
                </CardContent>
            </Card>
            <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
}
