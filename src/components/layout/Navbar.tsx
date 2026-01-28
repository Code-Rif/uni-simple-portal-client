import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <header className="h-16 bg-card border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search books, fellowships..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-semibold text-sm">
                                    {user?.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-foreground">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {user?.role}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowProfileMenu(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20 animate-slide-in">
                                    <div className="p-3 border-b border-border">
                                        <p className="text-sm font-medium text-foreground">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                window.location.href = "/profile";
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                                        >
                                            Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                handleLogout();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error-light transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
