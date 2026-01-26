import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";

type UserRole = "student" | "teacher" | "librarian";

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    // Student fields
    studentId?: string;
    department?: string;
    semester?: string;
    cgpa?: string;
    session?: string;
    enrollmentYear?: string;
    // Teacher fields
    teacherId?: string;
    designation?: string;
    teacherDepartment?: string;
    // Librarian fields
    librarianId?: string;
}

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRoleChange = (role: UserRole) => {
        setFormData((prev) => ({
            name: prev.name,
            email: prev.email,
            password: prev.password,
            confirmPassword: prev.confirmPassword,
            role,
        }));
        setErrors({});
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        // Common validations
        if (!formData.name) newErrors.name = "Name is required";
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
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Role-specific validations
        if (formData.role === "student") {
            if (!formData.studentId) newErrors.studentId = "Student ID is required";
            if (!formData.department) newErrors.department = "Department is required";
            if (!formData.semester) newErrors.semester = "Semester is required";
            if (!formData.cgpa) {
                newErrors.cgpa = "CGPA is required";
            } else if (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 4) {
                newErrors.cgpa = "CGPA must be between 0 and 4";
            }
            if (!formData.session) newErrors.session = "Session is required";
            if (!formData.enrollmentYear) newErrors.enrollmentYear = "Enrollment year is required";
        } else if (formData.role === "teacher") {
            if (!formData.teacherId) newErrors.teacherId = "Teacher ID is required";
            if (!formData.designation) newErrors.designation = "Designation is required";
            if (!formData.teacherDepartment) newErrors.teacherDepartment = "Department is required";
        } else if (formData.role === "librarian") {
            if (!formData.librarianId) newErrors.librarianId = "Librarian ID is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            // Prepare data for API
            const registerData: Record<string, unknown> = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            // Add role-specific fields
            if (formData.role === "student") {
                registerData.studentId = formData.studentId;
                registerData.department = formData.department;
                registerData.semester = Number(formData.semester);
                registerData.cgpa = Number(formData.cgpa);
                registerData.session = formData.session;
                registerData.enrollmentYear = Number(formData.enrollmentYear);
            } else if (formData.role === "teacher") {
                registerData.teacherId = formData.teacherId;
                registerData.designation = formData.designation;
                registerData.teacherDepartment = formData.teacherDepartment;
            } else if (formData.role === "librarian") {
                registerData.librarianId = formData.librarianId;
            }

            // API call to register endpoint
            await api.post("/auth/register", registerData);

            console.log("Registration data sent:", registerData);

            // Navigate to login after successful registration
            navigate("/login");
        } catch (error: unknown) {
            console.error("Registration error:", error);
            // Show all backend validation errors in the form fields if available
            const backendErrors =
                error && typeof error === "object" && "response" in error
                    ? (error as { response?: { data?: { errors?: unknown; message?: string } } })?.response?.data?.errors
                    : undefined;
            if (backendErrors && typeof backendErrors === "object") {
                setErrors(backendErrors as Partial<Record<keyof FormData, string>>);
            } else {
                const backendMessage =
                    error && typeof error === "object" && "response" in error
                        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
                        : undefined;
                const message = backendMessage ?? (error instanceof Error ? error.message : "Registration failed. Please try again.");
                setErrors({ email: message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderRoleFields = () => {
        switch (formData.role) {
            case "student":
                return (
                    <>
                        <Input
                            label="Student ID"
                            type="text"
                            name="studentId"
                            placeholder="e.g., S2024001"
                            value={formData.studentId || ""}
                            onChange={handleChange}
                            error={errors.studentId}
                            required
                        />
                        <Input
                            label="Department"
                            type="text"
                            name="department"
                            placeholder="e.g., Computer Science"
                            value={formData.department || ""}
                            onChange={handleChange}
                            error={errors.department}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Semester"
                                type="number"
                                name="semester"
                                placeholder="e.g., 5"
                                min="1"
                                max="12"
                                value={formData.semester || ""}
                                onChange={handleChange}
                                error={errors.semester}
                                required
                            />
                            <Input
                                label="CGPA"
                                type="number"
                                name="cgpa"
                                placeholder="e.g., 3.5"
                                min="0"
                                max="4"
                                step="0.01"
                                value={formData.cgpa || ""}
                                onChange={handleChange}
                                error={errors.cgpa}
                                required
                            />
                        </div>
                        <Input
                            label="Session"
                            type="text"
                            name="session"
                            placeholder="e.g., 2025-2026"
                            value={formData.session || ""}
                            onChange={handleChange}
                            error={errors.session}
                            required
                        />
                        <Input
                            label="Enrollment Year"
                            type="number"
                            name="enrollmentYear"
                            placeholder="e.g., 2025"
                            min="2000"
                            max={new Date().getFullYear()}
                            value={formData.enrollmentYear || ""}
                            onChange={handleChange}
                            error={errors.enrollmentYear}
                            required
                        />
                    </>
                );
            case "teacher":
                return (
                    <>
                        <Input
                            label="Teacher ID"
                            type="text"
                            name="teacherId"
                            placeholder="e.g., T2024001"
                            value={formData.teacherId || ""}
                            onChange={handleChange}
                            error={errors.teacherId}
                            required
                        />
                        <Input
                            label="Designation"
                            type="text"
                            name="designation"
                            placeholder="e.g., Assistant Professor"
                            value={formData.designation || ""}
                            onChange={handleChange}
                            error={errors.designation}
                            required
                        />
                        <Input
                            label="Department"
                            type="text"
                            name="teacherDepartment"
                            placeholder="e.g., Computer Science"
                            value={formData.teacherDepartment || ""}
                            onChange={handleChange}
                            error={errors.teacherDepartment}
                            required
                        />
                    </>
                );
            case "librarian":
                return (
                    <Input
                        label="Librarian ID"
                        type="text"
                        name="librarianId"
                        placeholder="e.g., L2024001"
                        value={formData.librarianId || ""}
                        onChange={handleChange}
                        error={errors.librarianId}
                        required
                    />
                );
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Join University Portal</h1>
                    <p className="text-lg text-primary-50 mb-8">
                        Create your account and start your journey towards academic excellence and unlimited opportunities.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                        <h3 className="font-semibold text-lg">What you'll get:</h3>
                        <ul className="space-y-2 text-sm text-primary-50">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                24/7 access to digital library
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                Fellowship and scholarship applications
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                Premium student email benefits
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                Personalized dashboard
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
                <Card className="w-full max-w-md border-0 shadow-none lg:shadow-card lg:border my-8">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          
                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    I am a <span className="text-error">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {(["student", "teacher", "librarian"] as UserRole[]).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => handleRoleChange(role)}
                                            className={`flex-1 py-2 px-4 rounded-md border-2 transition-all ${formData.role === role
                                                ? "border-primary bg-primary-50 text-primary font-medium"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <span className="capitalize">{role}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="Full Name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="your.email@university.edu"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email && errors.email !== "Registration failed. Please try again." ? errors.email : undefined}
                                required
                                autoComplete="email"
                            />

                            {renderRoleFields()}

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                    autoComplete="new-password"
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

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* General error message above button (not field errors) */}
                            {errors.email && typeof errors.email === "string" && errors.email === "Registration failed. Please try again." && (
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
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
