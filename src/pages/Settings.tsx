import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    // Placeholder: Replace with real fetch/update logic
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("Settings updated (demo only)");
    };

    return (
        <div className="max-w-xl mx-auto p-4 md:p-8 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your profile and password.</CardDescription>
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
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={profile.password}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="New password"
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            Save Changes
                        </button>
                        {message && <div className="text-green-600 mt-2">{message}</div>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
