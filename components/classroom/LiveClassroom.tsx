"use client";

import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

type Props = {
  role?: "teacher" | "student";
};

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionType;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function LiveClassroom({
  role = "teacher",
}: Props) {
  // --------------------------------
  // Agora refs
  // --------------------------------

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);

  const localVideoTrackRef =
    useRef<ICameraVideoTrack | null>(null);

  const localAudioTrackRef =
    useRef<IMicrophoneAudioTrack | null>(null);

  // --------------------------------
  // Speech recognition
  // --------------------------------

  const recognitionRef =
    useRef<SpeechRecognitionType | null>(null);

  const shouldRecognizeRef = useRef(false);

  // --------------------------------
  // Agora state
  // --------------------------------

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const [remoteUser, setRemoteUser] =
    useState<IAgoraRTCRemoteUser | null>(null);

  const [error, setError] = useState("");

  // --------------------------------
  // Transcript state
  // --------------------------------

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  // --------------------------------
  // AI state
  // --------------------------------

  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // --------------------------------
  // Environment
  // --------------------------------

  const APP_ID =
    process.env.NEXT_PUBLIC_AGORA_APP_ID || "";

  // Same channel for Teacher and Student
  const CHANNEL = "smart-classroom";

  // --------------------------------
  // Start speech recognition
  // --------------------------------

  const startSpeechRecognition = () => {
    if (role !== "teacher") return;

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        const text =
          result[0]?.transcript || "";

        if (result.isFinal) {
          finalText += text + " ";
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((previous) => {
          const updated =
            previous + finalText;

          // Keep transcript manageable
          return updated.slice(-5000);
        });
      }

      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: any) => {
      console.error(
        "Speech recognition error:",
        event
      );

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setError(
          "Microphone permission is required for live transcript."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;

      // Automatically restart while teacher is in class
      if (shouldRecognizeRef.current) {
        setTimeout(() => {
          if (shouldRecognizeRef.current) {
            startSpeechRecognition();
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    shouldRecognizeRef.current = true;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error(
        "Speech recognition start error:",
        err
      );
    }
  };

  // --------------------------------
  // Stop speech recognition
  // --------------------------------

  const stopSpeechRecognition = () => {
    shouldRecognizeRef.current = false;

    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error(err);
    }

    recognitionRef.current = null;
    setIsListening(false);
  };

  // --------------------------------
  // Join Agora
  // --------------------------------

  useEffect(() => {
    let mounted = true;

    const joinClass = async () => {
      try {
        setError("");

        // --------------------------------
        // Check App ID
        // --------------------------------

        if (!APP_ID) {
          setError(
            "Agora App ID is missing."
          );
          return;
        }

        // --------------------------------
        // Create Agora client
        // --------------------------------

        const client =
          AgoraRTC.createClient({
            mode: "rtc",
            codec: "vp8",
          });

        clientRef.current = client;

        // --------------------------------
        // Remote user published media
        // --------------------------------

        client.on(
          "user-published",
          async (user, mediaType) => {
            try {
              console.log(
                "Remote user published:",
                user.uid,
                mediaType
              );

              // Subscribe
              await client.subscribe(
                user,
                mediaType
              );

              if (!mounted) return;

              setRemoteUser(user);

              // --------------------------------
              // Remote video
              // --------------------------------

              if (
                mediaType === "video" &&
                user.videoTrack &&
                remoteVideoRef.current
              ) {
                user.videoTrack.play(
                  remoteVideoRef.current
                );
              }

              // --------------------------------
              // Remote audio
              // --------------------------------

              if (
                mediaType === "audio" &&
                user.audioTrack
              ) {
                user.audioTrack.play();
              }
            } catch (err) {
              console.error(
                "Subscribe error:",
                err
              );
            }
          }
        );

        // --------------------------------
        // Remote user unpublished
        // --------------------------------

        client.on(
          "user-unpublished",
          (user, mediaType) => {
            console.log(
              "User unpublished:",
              user.uid,
              mediaType
            );
          }
        );

        // --------------------------------
        // Remote user left
        // --------------------------------

        client.on(
          "user-left",
          (user) => {
            console.log(
              "User left:",
              user.uid
            );

            if (mounted) {
              setRemoteUser(null);
            }
          }
        );

        // --------------------------------
        // Generate UID
        // --------------------------------

        const uid = Math.floor(
          Math.random() * 100000
        );

        // --------------------------------
        // Get Agora token
        // --------------------------------

        const tokenResponse =
          await fetch(
            `/api/generate-agora-token?channel=${encodeURIComponent(
              CHANNEL
            )}&uid=${uid}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const tokenData =
          await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(
            tokenData?.error ||
              "Failed to generate Agora token"
          );
        }

        const token =
          tokenData.token;

        if (!token) {
          throw new Error(
            "Agora token was not generated."
          );
        }

        // --------------------------------
        // Join channel
        // --------------------------------

        console.log(
          "Joining Agora channel:",
          CHANNEL,
          "Role:",
          role,
          "UID:",
          uid
        );

        await client.join(
          APP_ID,
          CHANNEL,
          token,
          uid
        );

        if (!mounted) return;

        setJoined(true);

        console.log(
          "Successfully joined Agora!"
        );

        // --------------------------------
        // Create microphone + camera
        // --------------------------------

        const [
          microphoneTrack,
          cameraTrack,
        ] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        if (!mounted) {
          microphoneTrack.close();
          cameraTrack.close();
          return;
        }

        // --------------------------------
        // Save tracks
        // --------------------------------

        localAudioTrackRef.current =
          microphoneTrack;

        localVideoTrackRef.current =
          cameraTrack;

        // --------------------------------
        // Play local camera
        // --------------------------------

        if (localVideoRef.current) {
          cameraTrack.play(
            localVideoRef.current
          );
        }

        // --------------------------------
        // Publish
        // --------------------------------

        await client.publish([
          microphoneTrack,
          cameraTrack,
        ]);

        setMicOn(true);
        setCameraOn(true);

        console.log(
          `${role} camera and microphone published.`
        );

        // --------------------------------
        // Start transcript only for teacher
        // --------------------------------

        if (role === "teacher") {
          setTimeout(() => {
            if (mounted) {
              startSpeechRecognition();
            }
          }, 1000);
        }
      } catch (err) {
        console.error(
          "Agora error:",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to join the classroom. Check Agora App ID, token and browser permissions."
          );
        }
      }
    };

    joinClass();

    // --------------------------------
    // Cleanup
    // --------------------------------

    return () => {
      mounted = false;

      stopSpeechRecognition();

      localVideoTrackRef.current?.stop();
      localVideoTrackRef.current?.close();

      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();

      clientRef.current?.leave();

      clientRef.current = null;
      localVideoTrackRef.current = null;
      localAudioTrackRef.current = null;
    };
  }, [APP_ID, role]);

  // --------------------------------
  // Toggle microphone
  // --------------------------------

  const toggleMic = async () => {
    const track =
      localAudioTrackRef.current;

    if (!track) return;

    try {
      const newState = !micOn;

      await track.setEnabled(
        newState
      );

      setMicOn(newState);

      // Teacher transcript follows mic state
      if (
        role === "teacher"
      ) {
        if (newState) {
          startSpeechRecognition();
        } else {
          stopSpeechRecognition();
        }
      }
    } catch (err) {
      console.error(
        "Microphone error:",
        err
      );
    }
  };

  // --------------------------------
  // Toggle camera
  // --------------------------------

  const toggleCamera = async () => {
    const track =
      localVideoTrackRef.current;

    if (!track) return;

    try {
      const newState = !cameraOn;

      await track.setEnabled(
        newState
      );

      setCameraOn(newState);
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );
    }
  };

  // --------------------------------
  // Ask AI
  // --------------------------------

  const askAI = async () => {
    const cleanQuestion =
      question.trim();

    if (!cleanQuestion) return;

    setAiLoading(true);
    setAiError("");
    setAiAnswer("");

    try {
      const response =
        await fetch(
          "/api/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content:
                    "You are an AI Co-Teacher inside a live classroom. Help students understand lessons clearly. Give short, simple and educational answers. If useful, provide examples.",
                },
                {
                  role: "user",
                  content:
                    cleanQuestion,
                },
              ],
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI request failed"
        );
      }

      const answer =
        data?.choices?.[0]?.message
          ?.content ||
        data?.answer ||
        data?.message ||
        "Sorry, I could not generate an answer.";

      setAiAnswer(answer);
    } catch (err) {
      console.error(
        "AI error:",
        err
      );

      setAiError(
        err instanceof Error
          ? err.message
          : "Unable to connect to AI."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // --------------------------------
  // Ask AI on Enter
  // --------------------------------

  const handleQuestionKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      askAI();
    }
  };

  // --------------------------------
  // End class
  // --------------------------------

  const endClass = async () => {
    try {
      stopSpeechRecognition();

      localVideoTrackRef.current?.stop();
      localVideoTrackRef.current?.close();

      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();

      await clientRef.current?.leave();

      localVideoTrackRef.current =
        null;

      localAudioTrackRef.current =
        null;

      clientRef.current = null;

      setJoined(false);
      setRemoteUser(null);
    } catch (err) {
      console.error(
        "Leave error:",
        err
      );
    }
  };

  // --------------------------------
  // Clear transcript
  // --------------------------------

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================
          HEADER
      ================================= */}

      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">

        <div>
          <h1 className="text-xl font-bold">
            Smart Classroom AI
          </h1>

          <p className="text-sm text-slate-400">
            Live Classroom
          </p>
        </div>

        <div className="flex items-center gap-2">

          <span
            className={`h-3 w-3 rounded-full ${
              joined
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />

          <span
            className={`text-sm ${
              joined
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {joined
              ? "Agora Connected"
              : "Connecting..."}
          </span>

        </div>

      </header>

      <main className="p-6">

        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* ================================
            VIDEO SECTION
        ================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LOCAL VIDEO */}

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 lg:col-span-2">

            <div
              ref={localVideoRef}
              className="h-full min-h-[420px] w-full"
            />

            {/* Camera off */}

            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">

                <div className="text-center">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl">
                    {role === "teacher"
                      ? "👩‍🏫"
                      : "👨‍🎓"}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold">
                    {role === "teacher"
                      ? "Teacher"
                      : "Student"}
                  </h2>

                  <p className="text-slate-400">
                    Camera Off
                  </p>

                </div>

              </div>
            )}

            {/* Local label */}

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2">
              {role === "teacher"
                ? "Teacher"
                : "Student"}
            </div>

            {/* Listening badge */}

            {role === "teacher" &&
              isListening && (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Listening
                </div>
              )}

          </div>

          {/* REMOTE VIDEO */}

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">

            {remoteUser ? (
              <div
                ref={remoteVideoRef}
                className="h-full min-h-[420px] w-full"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl">
                    {role === "teacher"
                      ? "👨‍🎓"
                      : "👩‍🏫"}
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    {role === "teacher"
                      ? "Student"
                      : "Teacher"}
                  </h2>

                  <p className="text-slate-400">
                    Waiting to join...
                  </p>

                </div>

              </div>
            )}

            {/* Remote label */}

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2">
              {role === "teacher"
                ? "Student"
                : "Teacher"}
            </div>

          </div>

        </div>

        {/* ================================
            CONTROLS
        ================================= */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">

          {/* Mic */}

          <button
            onClick={toggleMic}
            className={`rounded-xl px-6 py-3 font-semibold ${
              micOn
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {micOn
              ? "🎤 Mic On"
              : "🔇 Mic Off"}
          </button>

          {/* Camera */}

          <button
            onClick={toggleCamera}
            className={`rounded-xl px-6 py-3 font-semibold ${
              cameraOn
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {cameraOn
              ? "📹 Camera On"
              : "📷 Camera Off"}
          </button>

          {/* Transcript */}

          {role === "teacher" && (
            <button
              onClick={() => {
                if (isListening) {
                  stopSpeechRecognition();
                } else {
                  startSpeechRecognition();
                }
              }}
              className={`rounded-xl px-6 py-3 font-semibold ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isListening
                ? "⏹ Stop Transcript"
                : "📝 Start Transcript"}
            </button>
          )}

          {/* End */}

          <button
            onClick={endClass}
            className="rounded-xl bg-red-600 px-8 py-3 font-semibold hover:bg-red-700"
          >
            ⏹ End Class
          </button>

        </div>

        {/* ================================
            AI SECTION
        ================================= */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* ================================
              LIVE TRANSCRIPT
          ================================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="text-2xl">
                  📝
                </span>

                <h3 className="text-xl font-bold">
                  Live Transcript
                </h3>

              </div>

              <button
                onClick={clearTranscript}
                className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700"
              >
                Clear
              </button>

            </div>

            <div className="mt-4 min-h-[220px] rounded-xl bg-slate-950 p-5">

              {role === "teacher" ? (
                <>
                  {transcript ||
                  interimTranscript ? (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                      {transcript}

                      {interimTranscript && (
                        <span className="text-slate-500">
                          {" "}
                          {interimTranscript}
                        </span>
                      )}
                    </p>
                  ) : (
                    <div className="flex h-[180px] items-center justify-center text-center">

                      <div>

                        <div className="text-4xl">
                          🎙️
                        </div>

                        <p className="mt-3 text-sm text-slate-400">
                          Start speaking to generate
                          the live transcript.
                        </p>

                      </div>

                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-[180px] items-center justify-center text-center">

                  <div>

                    <div className="text-4xl">
                      👨‍🏫
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      Teacher transcript will
                      appear here during the class.
                    </p>

                  </div>

                </div>
              )}

            </div>

            {role === "teacher" && (
              <p className="mt-3 text-xs text-slate-500">
                Speech recognition: English (India)
              </p>
            )}

          </div>

          {/* ================================
              AI CO-TEACHER
          ================================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-2">

              <span className="text-2xl">
                🤖
              </span>

              <h3 className="text-xl font-bold">
                AI Co-Teacher
              </h3>

            </div>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions and get help from
              your AI classroom assistant.
            </p>

            {/* Question input */}

            <div className="mt-5 flex gap-2">

              <input
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleQuestionKeyDown
                }
                placeholder="Ask your doubt..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <button
                onClick={askAI}
                disabled={
                  aiLoading ||
                  !question.trim()
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiLoading
                  ? "..."
                  : "Ask"}
              </button>

            </div>

            {/* AI response */}

            <div className="mt-4 min-h-[180px] rounded-xl bg-slate-950 p-5">

              {aiLoading ? (
                <div className="flex h-[150px] items-center justify-center">

                  <div className="text-center">

                    <div className="text-3xl">
                      🤖
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      AI is thinking...
                    </p>

                  </div>

                </div>
              ) : aiError ? (
                <div className="rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-300">
                  {aiError}
                </div>
              ) : aiAnswer ? (
                <div>

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-400">
                    <span>🤖</span>
                    AI Co-Teacher
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    {aiAnswer}
                  </p>

                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center text-center">

                  <div>

                    <div className="text-4xl">
                      💡
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      Ask something like:
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      "What is polymorphism in Java?"
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ================================
            CLASS STATUS
        ================================= */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <h3 className="font-semibold">
                Classroom Status
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {role === "teacher"
                  ? "You are hosting the live classroom."
                  : "You are attending the live classroom."}
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-slate-800 px-4 py-2 text-sm">
                👥{" "}
                {remoteUser
                  ? "2 Participants"
                  : "Waiting for participant"}
              </div>

              <div className="rounded-lg bg-slate-800 px-4 py-2 text-sm">
                {micOn
                  ? "🎤 Mic Active"
                  : "🔇 Mic Off"}
              </div>

              <div className="rounded-lg bg-slate-800 px-4 py-2 text-sm">
                {cameraOn
                  ? "📹 Camera Active"
                  : "📷 Camera Off"}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}