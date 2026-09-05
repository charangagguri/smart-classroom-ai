"use client";

import { useRouter } from "next/navigation";

type Role = "teacher" | "student";

interface RoleSelectionProps {
  role: Role;
  onBack: () => void;
}

export default function RoleSelection({
  role,
  onBack,
}: RoleSelectionProps) {
  const router = useRouter();

  const isTeacher = role === "teacher";

  const handleContinue = () => {
    if (isTeacher) {
      return;
    }

    // Student → Student Dashboard
    router.push("/student-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-slate-900">
          {isTeacher ? "Teacher Login" : "Student Login"}
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Enter your details to continue
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleContinue}
            className={`w-full rounded-xl px-6 py-3 text-lg font-semibold text-white ${
              isTeacher
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            Continue as {isTeacher ? "Teacher" : "Student"}
          </button>

          <button
            onClick={onBack}
            className="w-full rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}