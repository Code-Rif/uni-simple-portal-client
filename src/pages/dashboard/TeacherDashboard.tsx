import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
	const navigate = useNavigate();
	return (
		<div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
			<h1 className="text-2xl font-bold mb-8">Teacher Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow p-6 border flex flex-col items-center justify-center">
					<div className="text-4xl mb-2">📄</div>
					<div className="font-semibold text-lg mb-2">Upload Student Results</div>
					<div className="text-muted-foreground mb-4 text-center text-sm">
						Add or update results for your students by session and semester.
					</div>
					<button
						className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90 transition"
						onClick={() => navigate("/teacher/results")}
					>
						Go to Result Upload
					</button>
				</div>
<<<<<<< HEAD
=======
				{/* Add more teacher dashboard cards here as needed */}
>>>>>>> 0175a316361f2d0f3299d13e08e55ea45155c7d4
			</div>
		</div>
	);
};

<<<<<<< HEAD
export default TeacherDashboard;
=======
export default TeacherDashboard;
>>>>>>> 0175a316361f2d0f3299d13e08e55ea45155c7d4
