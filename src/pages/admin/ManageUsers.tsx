import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllUsers, toggleUserStatus, deleteUser } from "@/features/fellowship/adminApi";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchAllUsers()
            .then((data) => {
                setUsers(data.users || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load users");
                setLoading(false);
            });
    }, []);

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleUserStatus(id);
            setUsers((prev) => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
            setActionMsg("User status updated");
        } catch {
            setActionMsg("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter(u => u._id !== id));
            setActionMsg("User deleted");
        } catch {
            setActionMsg("Failed to delete user");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading users...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Email</th>
                                        <th className="p-2 border">Role</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="p-2 border">{user.name}</td>
                                            <td className="p-2 border">{user.email}</td>
                                            <td className="p-2 border">{user.role}</td>
                                            <td className="p-2 border">{user.isActive ? "Active" : "Inactive"}</td>
                                            <td className="p-2 border space-x-2">
                                                <button
                                                    className="px-2 py-1 rounded bg-primary text-white"
                                                    onClick={() => handleToggleStatus(user._id)}
                                                >
                                                    {user.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    className="px-2 py-1 rounded bg-red-500 text-white"
                                                    onClick={() => handleDelete(user._id)}
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
                    {actionMsg && <div className="mt-2 text-green-600">{actionMsg}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
