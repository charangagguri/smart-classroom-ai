"use client";

import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  const joinClassroom = () => {
    router.push("/classroom?role=student");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* Huge AGORA */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 text-[180px] md:text-[280px] lg:text-[380px] font-black tracking-[-0.09em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500/20 via-blue-500/8 to-transparent select-none">
          AGORA
        </div>

        {/* Blue glow */}
        <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[150px]" />

        {/* Cyan glow */}
        <div className="absolute top-[40%] right-[-200px] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

        {/* Purple glow */}
        <div className="absolute bottom-[-250px] left-[25%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[160px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.045]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-20 border-b border-blue-500/10 bg-slate-950/75 backdrop-blur-2xl">

        <div className="mx-auto max-w-7xl px-6 py-5">

          <div className="flex items-center justify-between">

            {/* Brand */}
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-600/10 text-2xl shadow-[0_0_25px_rgba(37,99,235,0.2)]">
                🎓
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Agora Classroom
                </h1>

                <p className="text-xs text-slate-500">
                  AI Powered Learning
                </p>
              </div>

            </div>

            {/* Right side */}
            <div className="flex items-center gap-5">

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />

                <span className="text-xs text-emerald-300">
                  AI Online
                </span>

              </div>

              <button
                onClick={() => router.push("/")}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* =================================================
            WELCOME
        ================================================= */}

        <div className="mb-10">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
                ✨ Student Learning Hub
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Welcome, Student
                <span className="ml-2">👋</span>
              </h2>

              <p className="mt-3 text-slate-400">
                Your intelligent classroom is ready.
                Learn, interact and grow with AI.
              </p>

            </div>

            {/* Live Status */}
            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">

              <p className="text-xs text-slate-500">
                CLASSROOM STATUS
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                <span className="font-semibold text-emerald-300">
                  Ready to Learn
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-blue-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-400">
              85%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Good standing
            </p>

          </div>

          <div className="rounded-2xl border border-blue-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Progress
            </p>

            <p className="mt-2 text-3xl font-black text-blue-400">
              70%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Course progress
            </p>

          </div>

          <div className="rounded-2xl border border-blue-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Classes
            </p>

            <p className="mt-2 text-3xl font-black text-cyan-400">
              01
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Active classroom
            </p>

          </div>

          <div className="rounded-2xl border border-blue-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              AI Assistant
            </p>

            <p className="mt-2 text-lg font-bold text-purple-400">
              Active
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Ready for questions
            </p>

          </div>

        </div>

        {/* =================================================
            FEATURE CARDS
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* LIVE CLASSROOM */}

          <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]">

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-3xl">
                  🎥
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  LIVE
                </span>

              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Live Classroom
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Join the live classroom and interact
                with your teacher in real time.
              </p>

              <button
                onClick={joinClassroom}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
              >
                Join Live Classroom →
              </button>

            </div>

          </div>

          {/* AI CO-TEACHER */}

          <div className="group relative overflow-hidden rounded-3xl border border-blue-500/30 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(37,99,235,0.14)]">

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-3xl">
                  🤖
                </div>

                <span className="text-xs text-blue-300">
                  AI READY
                </span>

              </div>

              <h3 className="mt-6 text-2xl font-bold">
                AI Co-Teacher
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Ask questions and get intelligent help
                from your AI classroom assistant.
              </p>

              <button
                onClick={joinClassroom}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3.5 font-bold shadow-lg shadow-blue-500/20 hover:brightness-110 transition"
              >
                Ask AI →
              </button>

            </div>

          </div>

          {/* ATTENDANCE */}

          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/50">

            <div className="flex items-start justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-3xl">
                📊
              </div>

              <span className="text-xs text-slate-500">
                THIS TERM
              </span>

            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Attendance
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Check your classroom attendance
              and participation.
            </p>

            <div className="mt-6 rounded-2xl border border-purple-500/15 bg-slate-950/60 p-5">

              <div className="flex items-end justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Attendance
                  </p>

                  <p className="mt-1 text-4xl font-black text-emerald-400">
                    85%
                  </p>
                </div>

                <span className="text-2xl">
                  📈
                </span>

              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />

              </div>

            </div>

          </div>

          {/* LIVE TRANSCRIPT */}

          <div className="group relative overflow-hidden rounded-3xl border border-fuchsia-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 text-3xl">
              📝
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Live Transcript
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              View the teacher&apos;s speech as live
              text during the class.
            </p>

            <button
              onClick={joinClassroom}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-3.5 font-bold shadow-lg shadow-purple-500/20 hover:brightness-110 transition"
            >
              View Transcript →
            </button>

          </div>

          {/* MY CLASSES */}

          <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-3xl">
              📚
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              My Classes
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              View your current classes and
              classroom information.
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-bold">
                    Smart Classroom
                  </p>

                  <p className="mt-1 text-sm text-emerald-400">
                    ● Live class available
                  </p>

                </div>

                <span className="text-2xl">
                  🏫
                </span>

              </div>

            </div>

          </div>

          {/* CLASS PROGRESS */}

          <div className="group relative overflow-hidden rounded-3xl border border-blue-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/50">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-3xl">
              🎯
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Class Progress
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Track your learning progress and
              classroom participation.
            </p>

            <div className="mt-6">

              <div className="mb-3 flex justify-between text-sm">

                <span className="text-slate-400">
                  Overall Progress
                </span>

                <span className="font-bold text-blue-400">
                  70%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]" />

              </div>

              <p className="mt-3 text-xs text-slate-500">
                Keep going — you&apos;re making good progress.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK ACTION
        ================================================= */}

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 via-slate-900/80 to-cyan-500/10 p-7 md:p-8 backdrop-blur-xl">

          {/* Glow */}

          <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="text-2xl">
                  🚀
                </span>

                <h3 className="text-2xl font-bold">
                  Ready for class?
                </h3>

              </div>

              <p className="mt-2 max-w-2xl text-slate-400">
                Join the live classroom to start learning
                with your teacher and AI Co-Teacher.
              </p>

            </div>

            <button
              onClick={joinClassroom}
              className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:brightness-110 transition"
            >
              Enter Classroom →
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-10 border-t border-blue-500/10 bg-slate-950/70 backdrop-blur-xl">

        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-sm tracking-[0.25em] text-blue-400/60">
            AGORA CLASSROOM
          </p>

          <p className="text-xs text-slate-600">
            AI Powered Learning • Powered by Agora
          </p>

        </div>

      </footer>

    </main>
  );
}