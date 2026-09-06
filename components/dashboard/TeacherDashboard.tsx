"use client";

import { useState } from "react";
import LiveClassroom from "../classroom/LiveClassroom";

export default function TeacherDashboard() {
  const [classStarted, setClassStarted] = useState(false);
  const [showClassroom, setShowClassroom] = useState(false);

  // Start Class → Open Live Classroom
  if (showClassroom) {
    return <LiveClassroom />;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* =====================================================
          PREMIUM AGORA BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* Huge AGORA */}
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 text-[170px] sm:text-[230px] md:text-[300px] lg:text-[380px] font-black tracking-[-0.09em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500/20 via-blue-500/8 to-transparent select-none">
          AGORA
        </div>

        {/* Blue glow */}
        <div className="absolute top-[-180px] left-[-180px] h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[150px]" />

        {/* Cyan glow */}
        <div className="absolute top-[35%] right-[-220px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

        {/* Purple glow */}
        <div className="absolute bottom-[-250px] left-[25%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[160px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.045]">
          <div
            className="h-full w-full"
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

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

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
                AI Powered Teaching
              </p>
            </div>

          </div>

          {/* Teacher */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold">
                Welcome, Teacher 👨‍🏫
              </p>

              <p className="text-xs text-slate-500">
                Teacher Portal
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-xl">
              👨‍🏫
            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-9">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
                ✨ Teacher Control Center
              </div>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Today&apos;s Class
              </h2>

              <p className="mt-3 text-slate-400">
                Manage your live classroom with intelligent AI assistance.
              </p>

            </div>

            {/* Status */}

            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                AI Classroom Status
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    classStarted
                      ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)] animate-pulse"
                      : "bg-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.7)]"
                  }`}
                />

                <span
                  className={`font-semibold ${
                    classStarted
                      ? "text-emerald-300"
                      : "text-yellow-300"
                  }`}
                >
                  {classStarted
                    ? "AI Listening"
                    : "Ready"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            CLASS INFORMATION
        ================================================= */}

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-blue-500/25 bg-slate-900/70 p-7 backdrop-blur-xl shadow-[0_0_50px_rgba(15,23,42,0.5)]">

          {/* Card glow */}

          <div className="absolute right-[-100px] top-[-130px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">

            <div className="mb-7 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-blue-400/70">
                  LIVE SESSION
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Classroom Information
                </h3>

              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-xl sm:flex">
                🏫
              </div>

            </div>

            {/* Information */}

            <div className="grid gap-5 md:grid-cols-3">

              {/* Subject */}

              <div className="rounded-2xl border border-blue-500/10 bg-slate-950/60 p-5">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Subject
                </p>

                <p className="mt-2 text-lg font-bold">
                  Python Programming
                </p>

                <p className="mt-1 text-xs text-blue-400">
                  Programming Fundamentals
                </p>

              </div>

              {/* Class */}

              <div className="rounded-2xl border border-blue-500/10 bg-slate-950/60 p-5">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Class
                </p>

                <p className="mt-2 text-lg font-bold">
                  CSE - A
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Live classroom session
                </p>

              </div>

              {/* AI Status */}

              <div className="rounded-2xl border border-blue-500/10 bg-slate-950/60 p-5">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  AI Status
                </p>

                <p
                  className={`mt-2 text-lg font-bold ${
                    classStarted
                      ? "text-emerald-400"
                      : "text-yellow-400"
                  }`}
                >
                  ●{" "}
                  {classStarted
                    ? "AI Listening"
                    : "Ready"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Classroom AI assistant
                </p>

              </div>

            </div>

            {/* Start Class */}

            <div className="mt-7">

              <button
                onClick={() => {
                  setClassStarted(true);
                  setShowClassroom(true);
                }}
                className="group rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-8 py-4 font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.25)] transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]"
              >

                <span className="mr-2">
                  ▶
                </span>

                Start Live Class

                <span className="ml-2 inline-block transition group-hover:translate-x-1">
                  →
                </span>

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-blue-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Subject
            </p>

            <p className="mt-2 font-bold text-blue-400">
              Python
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Current session
            </p>

          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              AI Assistant
            </p>

            <p className="mt-2 font-bold text-emerald-400">
              Active
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Ready to assist
            </p>

          </div>

          <div className="rounded-2xl border border-purple-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Transcript
            </p>

            <p className="mt-2 font-bold text-purple-400">
              Live
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Speech to text
            </p>

          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/60 p-5 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Classroom
            </p>

            <p className="mt-2 font-bold text-cyan-400">
              CSE - A
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Smart Classroom
            </p>

          </div>

        </div>

        {/* =================================================
            FEATURE CARDS
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* Live Transcript */}

          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]">

            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-3xl">
                📝
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Live Transcript
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                AI listens to the class and converts
                the teacher&apos;s speech into text.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-purple-500/10 bg-slate-950/60 px-4 py-3">

                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />

                <span className="text-xs text-purple-300">
                  Speech recognition ready
                </span>

              </div>

            </div>

          </div>

          {/* Student Doubts */}

          <div className="group relative overflow-hidden rounded-3xl border border-pink-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-[0_0_40px_rgba(236,72,153,0.12)]">

            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/10 text-3xl">
                ❓
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Student Doubts
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Students can ask questions and AI can
                provide answers during the class.
              </p>

              <div className="mt-6 rounded-xl border border-pink-500/10 bg-slate-950/60 px-4 py-3">

                <p className="text-xs text-slate-500">
                  AI RESPONSE SYSTEM
                </p>

                <p className="mt-1 text-sm text-pink-300">
                  Ready for student questions
                </p>

              </div>

            </div>

          </div>

          {/* Class Summary */}

          <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]">

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-3xl">
                📊
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Class Summary
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                AI generates important points and a
                summary after the class.
              </p>

              <div className="mt-6 rounded-xl border border-cyan-500/10 bg-slate-950/60 px-4 py-3">

                <p className="text-xs text-slate-500">
                  AI INSIGHTS
                </p>

                <p className="mt-1 text-sm text-cyan-300">
                  Summary generation ready
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            AI CLASSROOM ASSISTANT
        ================================================= */}

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-r from-blue-600/10 via-slate-900/80 to-cyan-500/10 p-7 backdrop-blur-xl md:p-8">

          <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex-1">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-2xl">
                    🤖
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
                      AI Classroom Assistant
                    </h3>

                    <p className="text-xs text-blue-400">
                      Intelligent teaching support
                    </p>

                  </div>

                </div>

                <div className="mt-5 rounded-2xl border border-blue-500/10 bg-slate-950/60 p-5">

                  {classStarted ? (

                    <div className="flex items-center gap-3">

                      <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />

                      <p className="text-emerald-300">
                        AI is listening to the live class...
                      </p>

                    </div>

                  ) : (

                    <div className="flex items-center gap-3">

                      <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]" />

                      <p className="text-slate-400">
                        Start the class to activate the AI assistant.
                      </p>

                    </div>

                  )}

                </div>

              </div>

              <div className="hidden select-none text-8xl opacity-20 md:block">
                🧠
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-10 border-t border-blue-500/10 bg-slate-950/70 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">

          <p className="text-sm tracking-[0.25em] text-blue-400/60">
            AGORA CLASSROOM
          </p>

          <p className="text-xs text-slate-600">
            AI Powered Teaching • Powered by Agora
          </p>

        </div>

      </footer>

    </main>
  );
}