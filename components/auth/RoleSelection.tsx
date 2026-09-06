"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "teacher" | "student";

interface RoleSelectionProps {
  role: Role;
  onBack: () => void;
}

type Student = {
  name: string;
  username: string;
  password: string;
};

export default function RoleSelection({
  role,
  onBack,
}: RoleSelectionProps) {
  const router = useRouter();

  const [mode, setMode] = useState<
    "login" | "register"
  >("login");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // STUDENT LOGIN
  // ==========================================

  const handleLogin = () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    const students: Student[] = JSON.parse(
      localStorage.getItem("smart_classroom_students") || "[]"
    );

    const student = students.find(
      (user) =>
        user.username.toLowerCase() ===
          username.toLowerCase() &&
        user.password === password
    );

    if (!student) {
      setError("Invalid username or password.");
      return;
    }

    localStorage.setItem(
      "loggedInStudent",
      student.name
    );

    router.push("/student-dashboard");
  };

  // ==========================================
  // STUDENT REGISTRATION
  // ==========================================

  const handleRegister = () => {
    setError("");
    setSuccess("");

    if (
      !name ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    const students: Student[] = JSON.parse(
      localStorage.getItem("smart_classroom_students") || "[]"
    );

    const alreadyExists = students.some(
      (user) =>
        user.username.toLowerCase() ===
        username.toLowerCase()
    );

    if (alreadyExists) {
      setError(
        "Username already exists. Please choose another username."
      );
      return;
    }

    const newStudent: Student = {
      name,
      username,
      password,
    };

    students.push(newStudent);

    localStorage.setItem(
      "smart_classroom_students",
      JSON.stringify(students)
    );

    setName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");

    setSuccess(
      "Registration successful! Please login."
    );

    setMode("login");
  };

  // ==========================================
  // STUDENT LOGIN / REGISTER UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex items-center justify-center px-6 py-10">

      {/* ======================================
          HUGE AGORA BACKGROUND
      ====================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Huge AGORA */}

        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[150px] sm:text-[220px] md:text-[300px] lg:text-[380px] font-black tracking-[-0.09em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-emerald-400/20 via-blue-500/10 to-transparent select-none">
          AGORA
        </div>

        {/* Green Glow */}

        <div className="absolute top-[-100px] left-[-180px] w-[550px] h-[550px] rounded-full bg-emerald-500/15 blur-[140px]" />

        {/* Blue Glow */}

        <div className="absolute bottom-[-200px] right-[-180px] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[150px]" />

        {/* Grid */}

        <div className="absolute inset-0 opacity-[0.06]">

          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

        </div>

        {/* Glow Lines */}

        <div className="absolute left-0 right-0 top-[45%] h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

        <div className="absolute left-0 right-0 top-[65%] h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      </div>

      {/* ======================================
          SIDE TEXT
      ====================================== */}

      <div className="hidden xl:block absolute left-10 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.5em] text-emerald-400/50 leading-8">
        LEARN
        <br />
        EXPLORE
        <br />
        DISCOVER
        <br />
        ACHIEVE
      </div>

      <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.5em] text-blue-400/50 leading-8 text-right">
        CONNECT
        <br />
        COLLABORATE
        <br />
        CREATE
        <br />
        GROW
      </div>

      {/* ======================================
          LOGIN CONTAINER
      ====================================== */}

      <div className="relative z-10 w-full max-w-lg">

        {/* Brand */}

        <div className="text-center mb-7">

          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(16,185,129,0.25)]">
            🎓
          </div>

          <h1 className="mt-5 text-3xl md:text-4xl font-black">
            Agora Classroom
          </h1>

          <p className="mt-2 text-emerald-300">
            Student Portal
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Learn. Explore. Achieve.
          </p>

        </div>

        {/* ==================================
            CARD
        ================================== */}

        <div className="rounded-[30px] border border-emerald-500/25 bg-slate-950/75 backdrop-blur-2xl p-7 md:p-9 shadow-[0_0_70px_rgba(15,23,42,0.8)]">

          {mode === "login" ? (
            <>
              {/* LOGIN */}

              <h2 className="text-2xl font-bold">
                Student Login 🎓
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Login to join your Agora Classroom.
              </p>

              <div className="mt-7 space-y-5">

                {/* Username */}

                <div>

                  <label className="text-sm text-slate-300">
                    Username
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      👤
                    </span>

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      placeholder="Enter username"
                      className="mt-2 w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/40"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="text-sm text-slate-300">
                    Password
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      🔒
                    </span>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                      className="mt-2 w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/40"
                    />

                  </div>

                </div>

                {/* Error */}

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Success */}

                {success && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {success}
                  </div>
                )}

                {/* Login */}

                <button
                  onClick={handleLogin}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 py-3.5 font-bold text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:brightness-110 transition"
                >
                  Login as Student →
                </button>

                {/* Register */}

                <button
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/60 py-3.5 font-semibold text-slate-300 hover:border-emerald-400/50 hover:bg-slate-800 transition"
                >
                  Create New Account
                </button>

                {/* Back */}

                <button
                  onClick={onBack}
                  className="w-full py-2 text-sm text-slate-500 hover:text-emerald-300 transition"
                >
                  ← Back to Agora Classroom
                </button>

              </div>
            </>
          ) : (
            <>
              {/* REGISTER */}

              <h2 className="text-2xl font-bold">
                Create Student Account 🚀
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Register for Agora Classroom.
              </p>

              <div className="mt-7 space-y-4">

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Full name"
                  className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Create username"
                  className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create password"
                  className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm password"
                  className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
                />

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {success}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 py-3.5 font-bold text-slate-950 hover:brightness-110 transition"
                >
                  Create Account →
                </button>

                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full rounded-xl border border-emerald-500/25 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Already have an account? Login
                </button>

                <button
                  onClick={onBack}
                  className="w-full py-2 text-sm text-slate-500 hover:text-emerald-300"
                >
                  ← Back to Agora Classroom
                </button>

              </div>
            </>
          )}

        </div>

        {/* Footer */}

        <div className="mt-6 text-center">

          <p className="text-xs tracking-[0.25em] text-emerald-400/60">
            AGORA CLASSROOM
          </p>

          <p className="mt-2 text-xs text-slate-600">
            AI Powered Learning • Powered by Agora
          </p>

        </div>

      </div>
    </div>
  );
}