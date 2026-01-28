// TODO: Implement TeacherResultEntry component for teachers to add student results in a tabular form (select session, semester, enter results).import React, { useState, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { fetchStudents, addResults } from "./resultApi";

type Student = {
    studentId: string;
};

type ResultRow = {
    studentId: string;
    subjectCode: string;
    grade: string;
};

const sessionOptions = ["2020-21", "2021-22", "2022-23", "2023-24"];
const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

const TeacherResultEntry = () => {
    const [session, setSession] = useState("");
    const [semester, setSemester] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [rows, setRows] = useState<ResultRow[]>([
        { studentId: "", subjectCode: "", grade: "" }
    ]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch students when session and semester are selected
    useEffect(() => {
        if (session && semester) {
            setLoading(true);
            fetchStudents(session, semester)
                .then((data) => {
                    setStudents(data);
                    // Pre-populate rows with student IDs
                    setRows(
                        data.map((s: Student) => ({
                            studentId: s.studentId,
                            subjectCode: "",
                            grade: "",
                        }))
                    );
                })
                .catch((err) => {
                    console.error("Failed to fetch students:", err);
                    alert("Failed to fetch students");
                })
                .finally(() => setLoading(false));
        } else {
            setStudents([]);
            setRows([{ studentId: "", subjectCode: "", grade: "" }]);
        }
    }, [session, semester]);

    const handleRowChange = (idx: number, field: keyof ResultRow, value: string) => {
        setRows((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
        );
    };

    const addRow = () => {
        setRows((prev) => [...prev, { studentId: "", subjectCode: "", grade: "" }]);
    };

    const removeRow = (idx: number) => {
        if (rows.length === 1) return;
        setRows((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate rows
        const validRows = rows.filter(
            (r) => r.studentId.trim() && r.subjectCode.trim() && r.grade.trim()
        );

        if (validRows.length === 0) {
            alert("Please add at least one complete result entry");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                session,
                semester,
                results: validRows.map((r) => ({
                    studentId: r.studentId,
                    subjectCode: r.subjectCode,
                    grade: r.grade,
                })),
            };

            await addResults(payload);
            alert("Results submitted successfully!");

            // Reset form
            setRows([{ studentId: "", subjectCode: "", grade: "" }]);
            setSession("");
            setSemester("");
        } catch (err: any) {
            console.error("Failed to submit results:", err);
            alert(err?.response?.data?.message || "Failed to submit results");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate average grade (if numeric)
    const calculateAverage = () => {
        const numericGrades = rows
            .map((r) => parseFloat(r.grade))
            .filter((g) => !isNaN(g));

        if (numericGrades.length === 0) return "-";
        const avg = numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length;
        return avg.toFixed(2);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session and Semester Selection */}
            <div className="flex gap-4 mb-4">
                <label className="flex flex-col flex-1">
                    <span className="mb-1 font-medium">Session</span>
                    <select
                        className="border rounded px-3 py-2"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        required
                    >
                        <option value="">Select session</option>
                        {sessionOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col flex-1">
                    <span className="mb-1 font-medium">Semester</span>
                    <select
                        className="border rounded px-3 py-2"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        required
                    >
                        <option value="">Select semester</option>
                        {semesterOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-4">
                    <span className="animate-spin inline-block">⏳</span> Loading students...
                </div>
            )}

            {/* Results Table or No Students Message */}
            {!loading && session && semester && (
                students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No students found for the selected session and semester.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-2 border">Student ID</th>
                                        <th className="p-2 border">Subject Code</th>
                                        <th className="p-2 border">Grade</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2 border">
                                                <input
                                                    className="border rounded px-2 py-1 w-32"
                                                    type="text"
                                                    value={row.studentId}
                                                    onChange={(e) =>
                                                        handleRowChange(idx, "studentId", e.target.value)
                                                    }
                                                    placeholder="Student ID"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <input
                                                    className="border rounded px-2 py-1 w-32"
                                                    type="text"
                                                    value={row.subjectCode}
                                                    onChange={(e) =>
                                                        handleRowChange(idx, "subjectCode", e.target.value)
                                                    }
                                                    placeholder="Subject Code"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <input
                                                    className="border rounded px-2 py-1 w-24"
                                                    type="text"
                                                    value={row.grade}
                                                    onChange={(e) =>
                                                        handleRowChange(idx, "grade", e.target.value)
                                                    }
                                                    placeholder="Grade"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border text-center">
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    onClick={() => removeRow(idx)}
                                                    disabled={rows.length === 1}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="p-2 border font-semibold text-right" colSpan={2}>
                                            Average Grade
                                        </td>
                                        <td className="p-2 border font-semibold" colSpan={2}>
                                            {calculateAverage()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-800 rounded px-4 py-2 font-semibold hover:bg-gray-300 transition"
                                onClick={addRow}
                            >
                                + Add Row
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Results"}
                            </button>
                        </div>
                    </>
                )
            )}

            {/* Empty State */}
            {!loading && (!session || !semester) && (
                <div className="text-center py-8 text-muted-foreground">
                    Please select session and semester to start entering results
                </div>
            )}
        </form>
    );
};

export default TeacherResultEntry;