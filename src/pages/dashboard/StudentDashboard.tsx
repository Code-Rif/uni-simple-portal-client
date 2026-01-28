import toast from "@/lib/sonner";


// -------------------- IMPORTS --------------------
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Award,
    Mail,
    CreditCard,
    TrendingUp,
    Clock,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMyApplications, withdrawFellowshipApplication } from "@/features/fellowship/fellowshipApi";
import { FellowshipApplication } from "@/features/fellowship/fellowshipTypes";

// -------------------- HELPER FUNCTIONS --------------------
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "approved":
            return <Badge variant="success">Approved</Badge>;
        case "under-review":
            return <Badge variant="warning">Under Review</Badge>;
        case "rejected":
            return <Badge variant="error">Rejected</Badge>;
        case "withdrawn":
            return <Badge variant="secondary">Withdrawn</Badge>;
        case "submitted":
            return <Badge variant="info">Submitted</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

// -------------------- MAIN COMPONENT --------------------
export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [applications, setApplications] = useState<FellowshipApplication[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [errorApps, setErrorApps] = useState<string | null>(null);
    const [withdrawing, setWithdrawing] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Stats for highlight cards (books, fellowships, email, cgpa)
    const stats = {
        booksIssued: 3, // TODO: Replace with real API data
        fellowshipsApplied: applications.length,
        emailBenefits: 12, // TODO: Replace with real API data
        cgpa: user?.cgpa || 0,
        submitted: applications.filter(app => app.status === "submitted").length,
        underReview: applications.filter(app => app.status === "under-review").length,
        approved: applications.filter(app => app.status === "approved").length,
        rejected: applications.filter(app => app.status === "rejected").length,
        withdrawn: applications.filter(app => app.status === "withdrawn").length,
    };

    // Dummy recent books data (replace with API data)
    const recentBooks = [
        {
            id: "1",
            title: "Introduction to Algorithms",
            author: "Cormen, Leiserson, Rivest, Stein",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
            id: "2",
            title: "Clean Code",
            author: "Robert C. Martin",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
    ];

    // Fetch student's fellowship applications
    useEffect(() => {
        setLoadingApps(true);
        fetchMyApplications()
            .then((data) => {
                setApplications(data.applications);
                setErrorApps(null);
            })
            .catch((err) => {
                setErrorApps(err?.response?.data?.message || "Failed to fetch applications");
            })
            .finally(() => setLoadingApps(false));
    }, [refreshKey]);

    const handleWithdraw = async (id: string) => {
        setWithdrawing(id);
        try {
            await withdrawFellowshipApplication(id);
            toast.success("Application withdrawn successfully.");
            setRefreshKey((k) => k + 1);
        } catch (err: unknown) {
            toast.error(err?.response?.data?.message || "Failed to withdraw application");
        } finally {
            setWithdrawing(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Greeting Section */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back to your academic dashboard
                </p>
            </div>


            {/* Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Library Access Card */}
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Books Issued
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.booksIssued}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/library-card"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View Library Card
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Fellowship Card - with status breakdown */}
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Fellowships Applied
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.fellowshipsApplied}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-warning-dark" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <span>Submitted: <span className="font-semibold text-foreground">{stats.submitted}</span></span>
                            <span>Under Review: <span className="font-semibold text-foreground">{stats.underReview}</span></span>
                            <span>Approved: <span className="font-semibold text-success">{stats.approved}</span></span>
                            <span>Rejected: <span className="font-semibold text-error">{stats.rejected}</span></span>
                            <span>Withdrawn: <span className="font-semibold text-muted-foreground">{stats.withdrawn}</span></span>
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/fellowships"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                Browse Fellowships
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Benefits Card */}
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Email Benefits
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.emailBenefits}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-info-light rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-info-dark" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/benefits"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                Explore Benefits
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* CGPA Card */}
                <Card className="hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Current CGPA
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.cgpa.toFixed(2)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-success-dark" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-muted-foreground">
                                Semester {user?.semester}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recently Borrowed Books */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Currently Borrowed Books
                        </CardTitle>
                        <CardDescription>
                            Keep track of your borrowed books and due dates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-foreground">
                                            {book.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            by {book.author}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            Due: {new Date(book.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Badge variant="info" className="ml-2">
                                        Borrowed
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                            <Link to="/library">
                                <Button variant="outline" className="w-full">
                                    Browse Library Catalog
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Fellowship Applications - Improved UI/UX */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Award className="w-5 h-5" />
                            My Fellowship Applications
                        </CardTitle>
                        <CardDescription>
                            Track your progress, status, and feedback for each application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingApps ? (
                            <div className="flex items-center justify-center py-8">
                                <span className="animate-spin mr-2">⏳</span> Loading applications...
                            </div>
                        ) : errorApps ? (
                            <div className="text-error text-center py-4">{errorApps}</div>
                        ) : (
                            <div className="divide-y divide-border">
                                {applications.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No applications found.</div>
                                ) : (
                                    applications.map((app) => (
                                        <div
                                            key={app._id}
                                            className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4 hover:bg-muted/70 transition-colors rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-base text-foreground">
                                                        {typeof app.fellowship === "string"
                                                            ? app.fellowship
                                                            : app.fellowship.name}
                                                    </h4>
                                                    {getStatusBadge(app.status)}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Applied on <span className="font-medium">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "N/A"}</span>
                                                </div>
                                                {app.status === "rejected" && app.rejectionReason && (
                                                    <div className="text-xs text-error mt-2 bg-error/10 rounded px-2 py-1">
                                                        <strong>Reason:</strong> {app.rejectionReason}
                                                    </div>
                                                )}
                                                {app.status === "approved" && app.adminRemarks && (
                                                    <div className="text-xs text-success mt-2 bg-success/10 rounded px-2 py-1">
                                                        <strong>Remarks:</strong> {app.adminRemarks}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                                {app.status === "submitted" && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={withdrawing === app._id}
                                                        onClick={() => handleWithdraw(app._id)}
                                                        className="w-full"
                                                    >
                                                        {withdrawing === app._id ? "Withdrawing..." : "Withdraw"}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        <div className="mt-6 pt-4 border-t border-border text-center">
                            <Link to="/fellowships">
                                <Button variant="outline" className="w-full md:w-auto">
                                    View All Fellowships
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Frequently used features for easy access
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/library-card">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <CreditCard className="w-4 h-4" />
                                View Library Card
                            </Button>
                        </Link>
                        <Link to="/fellowships">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Award className="w-4 h-4" />
                                Apply for Fellowship
                            </Button>
                        </Link>
                        <Link to="/benefits">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                Claim Email Benefits
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
