import TeacherResultEntry from "@/features/result/TeacherResultEntry";

const TeacherResultPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Upload Student Results</h1>
      <TeacherResultEntry />
    </div>
  );
};

export default TeacherResultPage;
