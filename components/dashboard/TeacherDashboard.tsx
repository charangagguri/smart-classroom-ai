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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Classroom AI</h1>
            <p className="text-sm text-slate-400">
              Teacher Dashboard
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">Welcome, Teacher 👩‍🏫</p>
            <p className="text-sm text-slate-400">
              teacher@example.com
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Class Information */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Today&apos;s Class
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your live class with AI assistance.
          </p>
        </div>

        {/* Class Card */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-slate-400">
                Subject
              </p>

              <p className="mt-1 text-lg font-semibold">
                Python Programming
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Class
              </p>

              <p className="mt-1 text-lg font-semibold">
                CSE - A
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                AI Status
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${
                  classStarted
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {classStarted
                  ? "● AI Listening"
                  : "● Ready"}
              </p>
            </div>

          </div>

          {/* Start / End Button */}
          <div className="mt-6">
            <button
              onClick={() => {
                setClassStarted(true);
                setShowClassroom(true);
              }}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              ▶ Start Class
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Live Transcript */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 text-3xl">
              📝
            </div>

            <h3 className="text-xl font-bold">
              Live Transcript
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              AI listens to the class and converts the
              teacher&apos;s speech into text.
            </p>
          </div>

          {/* Student Doubts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 text-3xl">
              ❓
            </div>

            <h3 className="text-xl font-bold">
              Student Doubts
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Students can ask questions and AI can
              provide answers during the class.
            </p>
          </div>

          {/* Class Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 text-3xl">
              📊
            </div>

            <h3 className="text-xl font-bold">
              Class Summary
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              AI generates important points and a
              summary after the class.
            </p>
          </div>

        </div>

        {/* Live AI Panel */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-bold">
            🎙️ AI Classroom Assistant
          </h3>

          <div className="mt-4 rounded-xl bg-slate-950 p-5">

            {classStarted ? (
              <p className="text-green-400">
                ● AI is listening to the live class...
              </p>
            ) : (
              <p className="text-slate-400">
                Start the class to activate the AI
                assistant.
              </p>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}