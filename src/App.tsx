import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import useTokenRefresh from "@/lib/useTokenRefresh";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TeacherResultPage from "./pages/dashboard/TeacherResultPage";

// Admin Pages
import AdminFellowshipPage from "./pages/admin/Fellowship";
import AdminFellowshipManagerPage from "./pages/admin/FellowshipManager";
import ManageUsersPage from "./pages/admin/ManageUsers";

// Feature Pages
import FellowshipList from "./features/fellowship/FellowshipList";
import ProfilePage from "./pages/Profile";

function App() {
    const { isAuthenticated, user } = useAuthStore();
    useTokenRefresh();

    return (
        <BrowserRouter>
            <Routes>
                {/* Root Redirect */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard - Role-based */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                {user?.role === "student" && <StudentDashboard />}
                                {user?.role === "teacher" && <TeacherDashboard />}
                                {user?.role === "admin" && <AdminDashboard />}
                                {user?.role === "librarian" && (
                                    <div className="p-8 text-center">
                                        <h1 className="text-2xl font-bold">Librarian Dashboard</h1>
                                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                                    </div>
                                )}
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Student Routes */}
                <Route
                    path="/fellowships"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MainLayout>
                                <FellowshipList />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/benefits"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MainLayout>
                                <div className="p-8 text-center">
                                    <h1 className="text-2xl font-bold">Email Benefits</h1>
                                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                                </div>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/library-card"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MainLayout>
                                <div className="p-8 text-center">
                                    <h1 className="text-2xl font-bold">My Library Card</h1>
                                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                                </div>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Teacher Routes */}
                <Route
                    path="/teacher/results"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <MainLayout>
                                <TeacherResultPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/fellowships"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <MainLayout>
                                <AdminFellowshipPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/fellowships/manage"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <MainLayout>
                                <AdminFellowshipManagerPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <MainLayout>
                                <ManageUsersPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Shared Routes */}
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute allowedRoles={["student", "teacher"]}>
                            <MainLayout>
                                <div className="p-8 text-center">
                                    <h1 className="text-2xl font-bold">Library Catalog</h1>
                                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                                </div>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ProfilePage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Error Pages */}
                <Route
                    path="/unauthorized"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-background">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-error">403</h1>
                                <p className="text-muted-foreground mt-2">Unauthorized Access</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You don't have permission to access this page.
                                </p>
                            </div>
                        </div>
                    }
                />

                {/* 404 Not Found */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-background">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold">404</h1>
                                <p className="text-muted-foreground m-4">Page Not Found</p>
                                <Link to="/" className="btn btn-primary bg-blue-500 hover:bg-blue-700 px-5 py-2 rounded-md text-white mt-2">Back to Home</Link>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;