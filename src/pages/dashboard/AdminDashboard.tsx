
import { Award, Users, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/features/fellowship/adminApi";


export default function AdminDashboard() {
    const [stats, setStats] = useState<{
        usersByRole?: { students: number; teachers: number };
        programCount?: number;
    }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAdminStats()
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load statistics");
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-8 p-4 md:p-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Welcome, Admin! 👋</h1>
                <p className="text-muted-foreground">Manage all aspects of the university portal from here.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Users className="w-10 h-10 text-primary mb-2" />
                        <span className="font-semibold text-lg">Students</span>
                        <span className="text-2xl font-bold mt-2">
                            {loading ? "-" : stats.usersByRole?.students ?? 0}
                        </span>
                    </CardContent>
                </Card>
                <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Users className="w-10 h-10 text-success mb-2" />
                        <span className="font-semibold text-lg">Teachers</span>
                        <span className="text-2xl font-bold mt-2">
                            {loading ? "-" : stats.usersByRole?.teachers ?? 0}
                        </span>
                    </CardContent>
                </Card>
                <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Award className="w-10 h-10 text-warning mb-2" />
                        <span className="font-semibold text-lg">Programs</span>
                        <span className="text-2xl font-bold mt-2">
                            {loading ? "-" : stats.programCount ?? 0}
                        </span>
                    </CardContent>
                </Card>
                <Link to="/settings" className="block">
                    <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <Settings className="w-10 h-10 text-info mb-2" />
                            <span className="font-semibold text-lg">Settings</span>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
            )}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Tips</CardTitle>
                        <CardDescription>Use the cards above to quickly access admin features. For more options, use the sidebar navigation.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
