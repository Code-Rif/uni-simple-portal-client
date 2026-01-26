import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            // TEMPORARY: Mock login for testing (remove when backend is ready)
            if (!import.meta.env.VITE_API_BASE_URL) {
                // Mock user data
                const mockUser = {
                    _id: "mock-user-123",
                    name: "John Doe",
                    email: formData.email,
                    role: "student" as const,
                    isActive: true,
                    studentId: "STU001",
                    department: "Computer Science",
                    semester: 5,
                    cgpa: 3.8,
                };
                
                const mockAccessToken = "mock-access-token-123";
                const mockRefreshToken = "mock-refresh-token-123";
                
                // Save to auth store
                login(mockUser, mockAccessToken, mockRefreshToken);
                
                // Navigate to dashboard after successful login
                navigate("/dashboard");
                setIsLoading(false);
                return;
            }
            
            const response = await api.post("/auth/login", formData);
            // The API returns { success, message, data: { user, accessToken, refreshToken } }
            const { user, accessToken, refreshToken } = response.data.data || {};

            console.log("Login response:", response.data);
            console.log("User object:", user);
            console.log("User role:", user?.role);

            // Save to auth store
            login(user, accessToken, refreshToken);

            // Navigate to dashboard after successful login
            navigate("/dashboard");
        } catch (error: unknown) {
            console.error("Login error:", error);
            const backendMessage =
                error && typeof error === "object" && "response" in error
                    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
                    : undefined;
            const message = backendMessage ?? (error instanceof Error ? error.message : "Invalid credentials. Please try again.");
            setErrors({ email: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4">University Portal</h1>
                    <p className="text-lg text-primary-50 mb-8">
                        Access your academic journey. Connect with resources, manage your studies, and unlock opportunities.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Digital Library Access</h3>
                                <p className="text-sm text-primary-100">Browse thousands of books and resources</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Fellowship Programs</h3>
                                <p className="text-sm text-primary-100">Apply for scholarships and grants</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Student Benefits</h3>
                                <p className="text-sm text-primary-100">Premium tools and services</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <Card className="w-full max-w-md border-0 shadow-none lg:shadow-card lg:border">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="your.email@university.edu"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email && errors.email !== "Invalid credentials. Please try again." ? errors.email : undefined}
                                required
                                autoComplete="email"
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-muted-foreground">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* General error message above button (not field errors) */}
                            {errors.email && !errors.password && errors.email === "Invalid credentials. Please try again." && (
                                <div className="text-error text-sm mb-2 text-center">{errors.email}</div>
                            )}
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary font-medium hover:underline">
                                    Create Account
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
