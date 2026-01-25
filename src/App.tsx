import ManageUsersPage from "./pages/admin/ManageUsers";
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

import AdminFellowshipPage from "./pages/admin/Fellowship";
import AdminFellowshipManagerPage from "./pages/admin/FellowshipManager";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import FellowshipList from "./features/fellowship/FellowshipList";
import { useAuthStore } from "./store/authStore";
import useTokenRefresh from "@/lib/useTokenRefresh";
import SettingsPage from "./pages/Settings";

function App() {
    const { isAuthenticated, user } = useAuthStore();
    useTokenRefresh();

    return (
        <BrowserRouter>
            <Routes>
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                {user?.role === "student" && <StudentDashboard />}
                                {user?.role === "teacher" && (
                                    <div className="p-8 text-center">
                                        <h1 className="text-2xl font-bold">
                                            Teacher Dashboard
                                        </h1>
                                        <p className="text-muted-foreground mt-2">
                                            Coming soon...
                                        </p>
                                    </div>
                                )}
                                {user?.role === "librarian" && (
                                    <div className="p-8 text-center">
                                        <h1 className="text-2xl font-bold">
                                            Librarian Dashboard
                                        </h1>
                                        <p className="text-muted-foreground mt-2">
                                            Coming soon...
                                        </p>
                                    </div>
                                )}
                                {user?.role === "admin" && <AdminDashboard />}
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Fellowship route for students */}
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

                {/* Placeholder protected routes */}
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute allowedRoles={["student", "teacher"]}>
                            <MainLayout>
                                <div className="p-8 text-center">
                                    <h1 className="text-2xl font-bold">Library Catalog</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Coming soon...
                                    </p>
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
                                    <p className="text-muted-foreground mt-2">
                                        Coming soon...
                                    </p>
                                </div>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Fellowship Management (Create) */}
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
                {/* Admin Fellowship Management (Manage) */}
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
                                    <p className="text-muted-foreground mt-2">
                                        Coming soon...
                                    </p>
                                </div>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <SettingsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized page */}
                <Route
                    path="/unauthorized"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-background">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-error">403</h1>
                                <p className="text-muted-foreground mt-2">
                                    Unauthorized Access
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    You don't have permission to access this page.
                                </p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
