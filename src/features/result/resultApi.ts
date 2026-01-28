import axios from "../../lib/axios";

// Add results (teacher)
export const addResults = async (payload: any) => {
  const res = await axios.post("/api/results", payload);
  return res.data;
};

// Fetch results for a student (student view)
export const fetchStudentResults = async (studentId: string) => {
  const res = await axios.get(`/api/results/${studentId}`);
  return res.data;
};

// Fetch all students for a session/semester (for teacher entry UI)
export const fetchStudents = async (session: string, semester: string) => {
  const res = await axios.get(`/api/admin/students`, {
    params: { session, semester },
  });
  return res.data;
};
