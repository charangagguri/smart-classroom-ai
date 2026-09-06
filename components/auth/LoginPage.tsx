"use client";

import { useState } from "react";
import TeacherDashboard from "../dashboard/TeacherDashboard";
import RoleSelection from "./RoleSelection";

type User = {
  name: string;
  username: string;
  password: string;
};

// ==========================================
// DEFAULT TEACHER ACCOUNTS
// ==========================================

const defaultTeachers: User[] = [
  {
    name: "Charan Gagguri",
    username: "Charan Gagguri",
    password: "Charan@55",
  },
  {
    name: "Shashank Raut",
    username: "Shashank Raut",
    password: "Shashank@55",
  },
  {
    name: "Vaidhavi Yadhav",
    username: "Vaidhavi Yadhav",
    password: "Vaidhavi@55",
  },
  {
    name: "Priyanshi Kukde",
    username: "Priyanshi Kukde",
    password: "Priyanshu@55",
  },
];

export default function LoginPage() {
  const [portal, setPortal] = useState<
    "home" | "teacher" | "student"
  >("home");

  const [teacherMode, setTeacherMode] = useState<
    "login" | "register"
  >("login");

  const [teacherUsername, setTeacherUsername] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loggedInTeacher, setLoggedInTeacher] = useState(false);

  // ==========================================
  // TEACHER LOGIN
  // ==========================================

  const handleTeacherLogin = () => {
    setError("");
    setSuccess("");

    if (!teacherUsername || !teacherPassword) {
      setError("Please enter username and password.");
      return;
    }

    const savedTeachers: User[] = JSON.parse(
      localStorage.getItem("smart_classroom_teachers") || "[]"
    );

    const allTeachers = [
      ...defaultTeachers,
      ...savedTeachers,
    ];

    const teacher = allTeachers.find(
      (user) =>
        user.username.toLowerCase() ===
          teacherUsername.toLowerCase() &&
        user.password === teacherPassword
    );

    if (!teacher) {
      setError("Invalid username or password.");
      return;
    }

    localStorage.setItem(
      "loggedInTeacher",
      teacher.name
    );

    setLoggedInTeacher(true);
  };

  // ==========================================
  // TEACHER REGISTRATION
  // ==========================================

  const handleTeacherRegister = () => {
    setError("");
    setSuccess("");

    if (
      !teacherName ||
      !registerUsername ||
      !registerPassword ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (registerPassword.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    const savedTeachers: User[] = JSON.parse(
      localStorage.getItem("smart_classroom_teachers") || "[]"
    );

    const allTeachers = [
      ...defaultTeachers,
      ...savedTeachers,
    ];

    const usernameExists = allTeachers.some(
      (user) =>
        user.username.toLowerCase() ===
        registerUsername.toLowerCase()
    );

    if (usernameExists) {
      setError(
        "Username already exists. Please choose another username."
      );
      return;
    }

    const newTeacher: User = {
      name: teacherName,
      username: registerUsername,
      password: registerPassword,
    };

    savedTeachers.push(newTeacher);

    localStorage.setItem(
      "smart_classroom_teachers",
      JSON.stringify(savedTeachers)
    );

    setTeacherName("");
    setRegisterUsername("");
    setRegisterPassword("");
    setConfirmPassword("");

    setSuccess(
      "Registration successful! Please login."
    );

    setTeacherMode("login");
  };

  // ==========================================
  // TEACHER DASHBOARD
  // ==========================================

  if (loggedInTeacher) {
    return <TeacherDashboard />;
  }

  // ==========================================
  // STUDENT PORTAL
  // ==========================================

  if (portal === "student") {
    return (
      <RoleSelection
        role="student"
        onBack={() => setPortal("home")}
      />
    );
  }

  // ==========================================
  // TEACHER LOGIN / REGISTER
  // ==========================================

  if (portal === "teacher") {
    return (
      <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex items-center justify-center px-6 py-10">

        {/* ======================================
            HUGE AGORA BACKGROUND
        ====================================== */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[150px] sm:text-[220px] md:text-[300px] lg:text-[380px] font-black tracking-[-0.09em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500/25 via-blue-500/10 to-transparent select-none">
            AGORA
          </div>

          <div className="absolute top-0 left-[-180px] w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[140px]" />

          <div className="absolute bottom-[-200px] right-[-180px] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

          <div className="absolute inset-0 opacity-[0.06]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(59,130,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.6) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Decorative glow lines */}
          <div className="absolute left-0 right-0 top-[45%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute left-0 right-0 top-[65%] h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        </div>

        {/* ======================================
            SIDE TEXT
        ====================================== */}

        <div className="hidden xl:block absolute left-10 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.5em] text-blue-400/60 leading-8">
          TEACH
          <br />
          INSPIRE
          <br />
          INNOVATE
          <br />
          TOGETHER
        </div>

        <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.5em] text-blue-400/60 leading-8 text-right">
          AI POWERED
          <br />
          CLASSROOMS
          <br />
          FOR A
          <br />
          BRIGHTER
          <br />
          TOMORROW
        </div>

        {/* ======================================
            LOGIN CONTAINER
        ====================================== */}

        <div className="relative z-10 w-full max-w-lg">

          {/* Brand */}

          <div className="text-center mb-7">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/50 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              🎓
            </div>

            <h1 className="mt-5 text-3xl md:text-4xl font-black">
              Agora Classroom
            </h1>

            <p className="mt-2 text-blue-300">
              Teacher Portal
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Empower Learning. Inspire the Future.
            </p>

          </div>

          {/* ==================================
              CARD
          ================================== */}

          <div className="rounded-[30px] border border-blue-500/30 bg-slate-950/75 backdrop-blur-2xl p-7 md:p-9 shadow-[0_0_70px_rgba(15,23,42,0.8)]">

            {teacherMode === "login" ? (
              <>
                {/* LOGIN */}

                <h2 className="text-2xl font-bold">
                  Teacher Login 👨‍🏫
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Login to manage your Agora Classroom.
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
                        value={teacherUsername}
                        onChange={(e) =>
                          setTeacherUsername(e.target.value)
                        }
                        placeholder="Enter username"
                        className="mt-2 w-full rounded-xl border border-blue-500/30 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50"
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
                        value={teacherPassword}
                        onChange={(e) =>
                          setTeacherPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleTeacherLogin();
                          }
                        }}
                        className="mt-2 w-full rounded-xl border border-blue-500/30 bg-slate-900/80 pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50"
                      />

                    </div>
                  </div>

                  {/* Messages */}

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

                  {/* Login */}

                  <button
                    onClick={handleTeacherLogin}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-3.5 font-bold shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:shadow-[0_0_35px_rgba(37,99,235,0.4)] hover:brightness-110 transition"
                  >
                    Login as Teacher →
                  </button>

                  {/* Register */}

                  <button
                    onClick={() => {
                      setTeacherMode("register");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full rounded-xl border border-blue-500/25 bg-slate-900/60 py-3.5 font-semibold text-slate-300 hover:border-blue-400/50 hover:bg-slate-800 transition"
                  >
                    Create New Account
                  </button>

                  {/* Back */}

                  <button
                    onClick={() => {
                      setPortal("home");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full py-2 text-sm text-slate-500 hover:text-blue-300 transition"
                  >
                    ← Back to Agora Classroom
                  </button>

                </div>
              </>
            ) : (
              <>
                {/* REGISTER */}

                <h2 className="text-2xl font-bold">
                  Create Teacher Account 🚀
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Register for Agora Classroom.
                </p>

                <div className="mt-7 space-y-4">

                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) =>
                      setTeacherName(e.target.value)
                    }
                    placeholder="Full name"
                    className="w-full rounded-xl border border-blue-500/30 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400"
                  />

                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) =>
                      setRegisterUsername(e.target.value)
                    }
                    placeholder="Create username"
                    className="w-full rounded-xl border border-blue-500/30 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400"
                  />

                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(e.target.value)
                    }
                    placeholder="Create password"
                    className="w-full rounded-xl border border-blue-500/30 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-blue-500/30 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-400"
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
                    onClick={handleTeacherRegister}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold hover:brightness-110 transition"
                  >
                    Create Account →
                  </button>

                  <button
                    onClick={() => {
                      setTeacherMode("login");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full rounded-xl border border-blue-500/25 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition"
                  >
                    Already have an account? Login
                  </button>

                  <button
                    onClick={() => setPortal("home")}
                    className="w-full py-2 text-sm text-slate-500 hover:text-blue-300"
                  >
                    ← Back to Agora Classroom
                  </button>

                </div>
              </>
            )}

          </div>

          {/* Footer */}

          <div className="mt-6 text-center">

            <p className="text-xs tracking-[0.25em] text-blue-400/60">
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

  // ==========================================
  // HOME PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* HUGE AGORA */}

        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 text-[180px] md:text-[280px] lg:text-[360px] font-black tracking-[-0.08em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500/25 via-blue-500/10 to-transparent select-none">
          AGORA
        </div>

        <div className="absolute top-20 left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="absolute bottom-[-250px] right-[-150px] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px]" />

        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

      </div>

      {/* Navbar */}

      <header className="relative z-10 border-b border-blue-500/10 bg-slate-950/70 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/40 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(37,99,235,0.2)]">
              🎓
            </div>

            <div>
              <h1 className="font-bold text-xl">
                Agora Classroom
              </h1>

              <p className="text-xs text-slate-500">
                AI Powered Learning
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />

            AI System Online

          </div>

        </div>

      </header>

      {/* Main */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">

        <section className="text-center max-w-5xl mx-auto">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">
            ✨ Next Generation Smart Classroom
          </div>

          <h2 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">

            The Classroom

            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
              Never Stops Learning.
            </span>

          </h2>

          <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            An AI-powered classroom where teachers, students and
            intelligent learning assistants work together in real time.
          </p>

        </section>

        {/* Portal Cards */}

        <section className="mt-16 grid md:grid-cols-2 gap-7 max-w-5xl mx-auto">

          {/* Teacher */}

          <button
            onClick={() => {
              setPortal("teacher");
              setTeacherMode("login");
              setError("");
              setSuccess("");
            }}
            className="group relative text-left rounded-[28px] border border-blue-500/40 bg-slate-900/70 backdrop-blur-xl p-8 overflow-hidden hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.2)] transition-all duration-300"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-500/40 flex items-center justify-center text-3xl">
                  👨‍🏫
                </div>

                <span className="text-2xl text-blue-400 group-hover:translate-x-1 transition">
                  →
                </span>

              </div>

              <div className="mt-7 text-[10px] tracking-[0.5em] text-blue-400/70">
                TEACH • INSPIRE • INNOVATE
              </div>

              <h3 className="mt-3 text-3xl font-bold">
                Teacher Portal
              </h3>

              <p className="mt-3 text-slate-400 leading-relaxed">
                Start live classes, use the AI Co-Teacher,
                interact with students and manage classroom
                activities.
              </p>

              <div className="mt-7 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-center font-bold">
                Login / Register →
              </div>

            </div>

          </button>

          {/* Student */}

          <button
            onClick={() => {
              setPortal("student");
            }}
            className="group relative text-left rounded-[28px] border border-emerald-500/40 bg-slate-900/70 backdrop-blur-xl p-8 overflow-hidden hover:border-emerald-400 hover:shadow-[0_0_45px_rgba(16,185,129,0.18)] transition-all duration-300"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-3xl">
                  🎓
                </div>

                <span className="text-2xl text-emerald-400 group-hover:translate-x-1 transition">
                  →
                </span>

              </div>

              <div className="mt-7 text-[10px] tracking-[0.5em] text-emerald-400/70">
                LEARN • EXPLORE • ACHIEVE
              </div>

              <h3 className="mt-3 text-3xl font-bold">
                Student Portal
              </h3>

              <p className="mt-3 text-slate-400 leading-relaxed">
                Join live classrooms, ask AI questions,
                view transcripts, quizzes and learning
                progress.
              </p>

              <div className="mt-7 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 py-3.5 text-center font-bold text-slate-950">
                Login / Register →
              </div>

            </div>

          </button>

        </section>

        {/* Features */}

        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">

          {[
            ["🎙️", "Live Voice AI"],
            ["🤖", "AI Co-Teacher"],
            ["📄", "Live Transcript"],
            ["📊", "Smart Analytics"],
          ].map(([icon, title]) => (
            <div
              key={title}
              className="rounded-2xl border border-blue-500/10 bg-slate-900/50 backdrop-blur-xl p-5 text-center"
            >
              <div className="mx-auto w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-xl">
                {icon}
              </div>

              <p className="mt-3 text-sm text-slate-300">
                {title}
              </p>
            </div>
          ))}

        </section>

      </main>

      {/* Footer */}

      <footer className="relative z-10 border-t border-blue-500/10 bg-slate-950/70 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-sm tracking-[0.3em] text-blue-400/70">
            AGORA CLASSROOM
          </p>

          <p className="text-xs text-slate-600">
            AI Powered Learning • Powered by Agora
          </p>

          <p className="text-2xl font-bold text-blue-400">
            agora
          </p>

        </div>

      </footer>

    </div>
  );
}