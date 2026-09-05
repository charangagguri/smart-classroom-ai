"use client";

import { useState } from "react";
import RoleSelection from "./RoleSelection";
import TeacherDashboard from "../dashboard/TeacherDashboard";

export default function LoginPage() {
  const [role, setRole] = useState<"teacher" | "student" | null>(null);

  // Teacher selected → Teacher Dashboard
  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  // Student selected → Student login flow
  if (role === "student") {
    return (
      <RoleSelection
        role={role}
        onBack={() => setRole(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-slate-900">
          Smart Classroom AI
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Select your login type
        </p>

        {/* Login Buttons */}
        <div className="mt-8 space-y-4">
          
          {/* Teacher */}
          <button
            onClick={() => setRole("teacher")}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            👩‍🏫 Teacher Login
          </button>

          {/* Student */}
          <button
            onClick={() => setRole("student")}
            className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white hover:bg-emerald-700"
          >
            👨‍🎓 Student Login
          </button>

        </div>
      </div>
    </div>
  );
}