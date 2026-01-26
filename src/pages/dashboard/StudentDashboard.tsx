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

export default function StudentDashboard() {
    const { user } = useAuthStore();

    // Mock data - will be replaced with actual API calls
    const stats = {
        booksIssued: 3,
        fellowshipsApplied: 2,
        emailBenefits: 12,
        cgpa: user?.cgpa || 0,
    };

    const recentBooks = [
        {
            id: "1",
            title: "Introduction to Algorithms",
            author: "Thomas H. Cormen",
            dueDate: "2026-01-28",
            status: "borrowed",
        },
        {
            id: "2",
            title: "Clean Code",
            author: "Robert C. Martin",
            dueDate: "2026-02-05",
            status: "borrowed",
        },
        {
            id: "3",
            title: "Design Patterns",
            author: "Gang of Four",
            dueDate: "2026-02-10",
            status: "borrowed",
        },
    ];

    const fellowshipUpdates = [
        {
            id: "1",
            title: "Merit-Based Scholarship 2026",
            status: "under-review",
            appliedDate: "2026-01-15",
        },
        {
            id: "2",
            title: "Research Fellowship",
            status: "approved",
            appliedDate: "2025-12-20",
        },
    ];

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
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Greeting Section */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    {getGreeting()}, {user?.name.split(" ")[0]}! 👋
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

                {/* Fellowship Card */}
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Fellowships
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {stats.fellowshipsApplied}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-warning-dark" />
                            </div>
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

                {/* Fellowship Updates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Fellowship Applications
                        </CardTitle>
                        <CardDescription>
                            Track your fellowship and scholarship applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {fellowshipUpdates.map((fellowship) => (
                                <div
                                    key={fellowship.id}
                                    className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-foreground">
                                            {fellowship.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Applied on{" "}
                                            {new Date(fellowship.appliedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="ml-2">
                                        {getStatusBadge(fellowship.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                            <Link to="/fellowships">
                                <Button variant="outline" className="w-full">
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
