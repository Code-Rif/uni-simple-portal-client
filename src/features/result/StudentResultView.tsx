import  { useEffect, useState } from 'react';
// import { fetchStudentResults } from './resultApi';

const StudentResultView = () => {
    // TODO: Replace with real student ID from auth context/store
    const studentId = "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // TODO: Fetch results from API
        // setLoading(true);
        // fetchStudentResults(studentId)
        //   .then(data => setResults(data.data))
        //   .catch(() => setError("Failed to load results"))
        //   .finally(() => setLoading(false));
    }, [studentId]);

    return (
        <div className="bg-white rounded-lg shadow p-6 border max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">My Results</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && results.length === 0 && <div>No results found.</div>}
            {!loading && !error && results.length > 0 && (
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-2 border">Session</th>
                            <th className="p-2 border">Semester</th>
                            <th className="p-2 border">Subject Code</th>
                            <th className="p-2 border">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2 border">{r.session}</td>
                                <td className="p-2 border">{r.semester}</td>
                                <td className="p-2 border">{r.subjectCode}</td>
                                <td className="p-2 border">{r.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* TODO: Add download as PDF button */}
        </div>
    );
}


export default StudentResultView;