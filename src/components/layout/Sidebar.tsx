import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    Award,
    Mail,
    Users,
    BookMarked,
    Settings,
    GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path: string;
    roles: string[];
}

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: "/dashboard",
        roles: ["student", "teacher", "librarian", "admin"],
    },
    // Student Menu Items
    {
        title: "Library",
        icon: <BookOpen className="w-5 h-5" />,
        path: "/library",
        roles: ["student", "teacher"],
    },
    {
        title: "My Library Card",
        icon: <CreditCard className="w-5 h-5" />,
        path: "/library-card",
        roles: ["student"],
    },
    {
        title: "Fellowships",
        icon: <Award className="w-5 h-5" />,
        path: "/fellowships",
        roles: ["student"],
    },
    {
        title: "Email Benefits",
        icon: <Mail className="w-5 h-5" />,
        path: "/benefits",
        roles: ["student"],
    },
    // Admin Menu Items
    {
        title: "Create Fellowship",
        icon: <Award className="w-5 h-5" />,
        path: "/admin/fellowships",
        roles: ["admin"],
    },
    {
        title: "Manage Fellowships",
        icon: <Award className="w-5 h-5" />,
        path: "/admin/fellowships/manage",
        roles: ["admin"],
    },
    {
        title: "Manage Users",
        icon: <Users className="w-5 h-5" />,
        path: "/admin/users",
        roles: ["admin"],
    },
    // Librarian Menu Items
    {
        title: "Manage Books",
        icon: <BookMarked className="w-5 h-5" />,
        path: "/librarian/books",
        roles: ["librarian"],
    },
    {
        title: "Library Cards",
        icon: <CreditCard className="w-5 h-5" />,
        path: "/librarian/cards",
        roles: ["librarian"],
    },
    // Common Items
    {
        title: "Settings",
        icon: <Settings className="w-5 h-5" />,
        path: "/settings",
        roles: ["student", "teacher", "librarian", "admin"],
    },
];

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuthStore();

    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(user?.role || "")
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col shadow-sm">
            {/* Logo/Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">University</h1>
                        <p className="text-xs text-muted-foreground">Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {filteredMenuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
