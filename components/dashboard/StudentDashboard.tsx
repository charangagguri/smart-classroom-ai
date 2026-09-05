"use client";

import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  const joinClassroom = () => {
    router.push("/classroom?role=student");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Classroom AI</h1>
            <p className="text-sm text-slate-400">Student Dashboard</p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-red-600 px-5 py-2 font-medium hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, Student 👋
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your classes and join your live classroom.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Live Classroom */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">🎥</div>

            <h3 className="text-xl font-semibold">
              Live Classroom
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Join the live classroom and interact with your teacher.
            </p>

            <button
              onClick={joinClassroom}
              className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold hover:bg-green-700"
            >
              Join Live Classroom
            </button>
          </div>

          {/* AI Co-Teacher */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">🤖</div>

            <h3 className="text-xl font-semibold">
              AI Co-Teacher
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions and get help from the AI classroom assistant.
            </p>

            <button
              onClick={joinClassroom}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700"
            >
              Ask AI
            </button>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">📊</div>

            <h3 className="text-xl font-semibold">
              Attendance
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Check your classroom attendance and participation.
            </p>

            <div className="mt-6 rounded-lg bg-slate-800 p-4 text-center">
              <p className="text-sm text-slate-400">
                Attendance
              </p>

              <p className="mt-1 text-3xl font-bold text-green-400">
                85%
              </p>
            </div>
          </div>

          {/* Live Transcript */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">📝</div>

            <h3 className="text-xl font-semibold">
              Live Transcript
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              View the teacher&apos;s speech as live text during the class.
            </p>

            <button
              onClick={joinClassroom}
              className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold hover:bg-purple-700"
            >
              View Transcript
            </button>
          </div>

          {/* My Classes */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">📚</div>

            <h3 className="text-xl font-semibold">
              My Classes
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              View your current classes and classroom information.
            </p>

            <div className="mt-6 rounded-lg bg-slate-800 p-4">
              <p className="font-medium">
                Smart Classroom
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Live class available
              </p>
            </div>
          </div>

          {/* Class Progress */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 text-4xl">🎯</div>

            <h3 className="text-xl font-semibold">
              Class Progress
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Track your learning progress and classroom participation.
            </p>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>70%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700">
                <div className="h-3 w-[70%] rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action */}
        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            Ready for class?
          </h3>

          <p className="mt-2 text-slate-400">
            Join the live classroom to start learning with your teacher and AI
            Co-Teacher.
          </p>

          <button
            onClick={joinClassroom}
            className="mt-5 rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
          >
            🚀 Enter Classroom
          </button>
        </div>

      </section>
    </main>
  );
}