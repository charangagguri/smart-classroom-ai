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
  // =========================================================
  // AGORA REFS
  // =========================================================

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);

  const localVideoTrackRef =
    useRef<ICameraVideoTrack | null>(null);

  const localAudioTrackRef =
    useRef<IMicrophoneAudioTrack | null>(null);

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  const recognitionRef =
    useRef<SpeechRecognitionType | null>(null);

  const shouldRecognizeRef = useRef(false);

  // =========================================================
  // AGORA STATE
  // =========================================================

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const [remoteUser, setRemoteUser] =
    useState<IAgoraRTCRemoteUser | null>(null);

  const [error, setError] = useState("");

  // =========================================================
  // TRANSCRIPT STATE
  // =========================================================

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  // =========================================================
  // AI STATE
  // =========================================================

  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // =========================================================
  // SMART BOARD STATE
  // =========================================================

  const [lessonTopic, setLessonTopic] = useState(
    "Python Variables"
  );

  const [boardLoading, setBoardLoading] =
    useState(false);

  const [boardError, setBoardError] =
    useState("");

  const [boardLesson, setBoardLesson] = useState({
    title: "Python Programming",
    subtitle: "Introduction to Python Variables",
    conceptTitle: "What is a Variable?",
    concept: "A variable is a named location used to store data in a Python program.",
    exampleTitle: "Example",
    example: 'name = "Charan"\nage = 20\ncourse = "CSE"',
    important: "Python variables do not require explicit data type declaration. The type is determined automatically from the assigned value.",
  });

  // =========================================================
  // ENVIRONMENT
  // =========================================================

  const APP_ID =
    process.env.NEXT_PUBLIC_AGORA_APP_ID || "";

  // IMPORTANT:
  // Teacher and Student use the SAME channel.
  const CHANNEL = "smart-classroom";

  // =========================================================
  // FORMAT AI ANSWER
  // =========================================================

  const formatAIAnswer = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/```python/gi, "")
      .replace(/```javascript/gi, "")
      .replace(/```java/gi, "")
      .replace(/```typescript/gi, "")
      .replace(/```tsx/gi, "")
      .replace(/```ts/gi, "")
      .replace(/```jsx/gi, "")
      .replace(/```/g, "")
      .replace(/^\*\s+/gm, "• ")
      .replace(/^-\s+/gm, "• ")
      .trim();
  };

  // =========================================================
  // START SPEECH RECOGNITION
  // =========================================================

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

  // =========================================================
  // STOP SPEECH RECOGNITION
  // =========================================================

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

  // =========================================================
  // JOIN AGORA
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const joinClass = async () => {
      try {
        setError("");

        // -----------------------------------------------------
        // CHECK APP ID
        // -----------------------------------------------------

        if (!APP_ID) {
          setError("Agora App ID is missing.");
          return;
        }

        // -----------------------------------------------------
        // CREATE AGORA CLIENT
        // -----------------------------------------------------

        const client =
          AgoraRTC.createClient({
            mode: "rtc",
            codec: "vp8",
          });

        clientRef.current = client;

        // -----------------------------------------------------
        // REMOTE USER PUBLISHED
        // -----------------------------------------------------

        client.on(
          "user-published",
          async (user, mediaType) => {
            try {
              console.log(
                "Remote user published:",
                user.uid,
                mediaType
              );

              await client.subscribe(
                user,
                mediaType
              );

              if (!mounted) return;

              setRemoteUser(user);

              // Remote video
              if (
                mediaType === "video" &&
                user.videoTrack &&
                remoteVideoRef.current
              ) {
                user.videoTrack.play(
                  remoteVideoRef.current
                );
              }

              // Remote audio
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

        // -----------------------------------------------------
        // REMOTE USER UNPUBLISHED
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // REMOTE USER LEFT
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // GENERATE UID
        // -----------------------------------------------------

        const uid = Math.floor(
          Math.random() * 100000
        );

        // -----------------------------------------------------
        // GET AGORA TOKEN
        // -----------------------------------------------------
        // DO NOT CHANGE THIS API REQUEST.
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // JOIN CHANNEL
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // CREATE MICROPHONE + CAMERA
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // SAVE TRACKS
        // -----------------------------------------------------

        localAudioTrackRef.current =
          microphoneTrack;

        localVideoTrackRef.current =
          cameraTrack;

        // -----------------------------------------------------
        // PLAY LOCAL CAMERA
        // -----------------------------------------------------

        if (localVideoRef.current) {
          cameraTrack.play(
            localVideoRef.current
          );
        }

        // -----------------------------------------------------
        // PUBLISH
        // -----------------------------------------------------

        await client.publish([
          microphoneTrack,
          cameraTrack,
        ]);

        setMicOn(true);
        setCameraOn(true);

        console.log(
          `${role} camera and microphone published.`
        );

        // -----------------------------------------------------
        // START TRANSCRIPT ONLY FOR TEACHER
        // -----------------------------------------------------

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

    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------

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

  // =========================================================
  // TOGGLE MICROPHONE
  // =========================================================

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

      // Teacher transcript follows mic
      if (role === "teacher") {
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

  // =========================================================
  // TOGGLE CAMERA
  // =========================================================

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

  // =========================================================
  // GENERATE SMART BOARD
  // Uses the existing AI API route. No API route is changed.
  // =========================================================

  const generateBoard = async () => {
    const topic = lessonTopic.trim();

    if (!topic) return;

    setBoardLoading(true);
    setBoardError("");

    try {
      const response = await fetch(
        "/api/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You create concise digital smart board lesson content for a classroom. Return ONLY valid JSON with exactly these string fields: title, subtitle, conceptTitle, concept, exampleTitle, example, important. Keep the explanation simple for college students. Put a short code or practical example in example when appropriate. Do not use markdown or code fences.",
              },
              {
                role: "user",
                content: `Create a smart board lesson for this topic: ${topic}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate smart board content"
        );
      }

      const rawAnswer =
        data?.choices?.[0]?.message?.content ||
        data?.answer ||
        data?.message ||
        "";

      const cleaned = rawAnswer
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const generated = JSON.parse(cleaned);

      setBoardLesson({
        title: String(
          generated.title || topic
        ),
        subtitle: String(
          generated.subtitle ||
            `AI generated lesson for ${topic}`
        ),
        conceptTitle: String(
          generated.conceptTitle ||
            "Key Concept"
        ),
        concept: String(
          generated.concept ||
            "AI generated explanation is ready."
        ),
        exampleTitle: String(
          generated.exampleTitle ||
            "Example"
        ),
        example: String(
          generated.example ||
            "No example available."
        ),
        important: String(
          generated.important ||
            "Review the concept and example carefully."
        ),
      });
    } catch (err) {
      console.error(
        "Smart board generation error:",
        err
      );

      setBoardError(
        err instanceof Error
          ? err.message
          : "Unable to generate smart board content."
      );
    } finally {
      setBoardLoading(false);
    }
  };

  // =========================================================
  // ASK AI
  // =========================================================
  // IMPORTANT:
  // API REQUEST IS KEPT SAME.
  // =========================================================

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
      setQuestion("");
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

  // =========================================================
  // ASK AI ON ENTER
  // =========================================================

  const handleQuestionKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      askAI();
    }
  };

  // =========================================================
  // END CLASS
  // =========================================================

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

  // =========================================================
  // CLEAR TRANSCRIPT
  // =========================================================

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030817] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[25%] top-[18%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute right-[10%] top-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 text-[220px] font-black tracking-tighter text-blue-500/[0.035] md:text-[320px]">
          AGORA
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 border-b border-white/10 bg-[#04091b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 text-2xl shadow-lg shadow-blue-500/10">
              🎓
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight md:text-xl">
                Agora Classroom
              </h1>

              <p className="text-xs text-slate-500 md:text-sm">
                AI Powered Smart Learning
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 sm:flex">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              {joined
                ? "Agora Connected"
                : "Connecting..."}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
              {role === "teacher"
                ? "👩‍🏫 Teacher"
                : "🎓 Student"}
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-8">

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ===================================================
            TOP CLASSROOM AREA
        =================================================== */}

        <section className="grid items-start gap-5 xl:grid-cols-[1.05fr_1.05fr_0.9fr]">

          {/* =================================================
              LOCAL VIDEO
          ================================================= */}

          <div className="group relative h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-[#081124] shadow-2xl shadow-black/30">

            <div
              ref={localVideoRef}
              className="absolute inset-0 h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
            />

            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#071022]">

                <div className="text-center">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-4xl">
                    {role === "teacher"
                      ? "👩‍🏫"
                      : "🎓"}
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    {role === "teacher"
                      ? "Teacher"
                      : "Student"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Camera Off
                  </p>

                </div>

              </div>
            )}

            {/* Gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Top badge */}
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-semibold backdrop-blur-md">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              You •{" "}
              {role === "teacher"
                ? "Teacher"
                : "Student"}

            </div>

            {/* Listening */}
            {role === "teacher" &&
              isListening && (
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2 text-xs font-bold shadow-lg">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                  AI Listening

                </div>
              )}

            {/* Bottom label */}
            <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-black/65 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              {role === "teacher"
                ? "Teacher"
                : "Student"}
            </div>

          </div>

          {/* =================================================
              REMOTE VIDEO
          ================================================= */}

          <div className="relative h-[420px] overflow-hidden rounded-[24px] border border-cyan-500/20 bg-[#081124] shadow-2xl shadow-black/30">

            {remoteUser ? (
              <div
                ref={remoteVideoRef}
                className="absolute inset-0 h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-4xl">
                    {role === "teacher"
                      ? "🎓"
                      : "👩‍🏫"}
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    {role === "teacher"
                      ? "Student"
                      : "Teacher"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Waiting to join the classroom...
                  </p>

                </div>

              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-semibold backdrop-blur-md">
              🎓{" "}
              {role === "teacher"
                ? "Student"
                : "Teacher"}
            </div>

            <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-black/65 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              {role === "teacher"
                ? "Student"
                : "Teacher"}
            </div>

          </div>

          {/* =================================================
              AI CO-TEACHER
          ================================================= */}

          <div className="flex h-[500px] min-h-0 flex-col overflow-hidden rounded-[24px] border border-blue-500/20 bg-[#081124]/95 shadow-2xl shadow-black/30">

            {/* AI Header */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-xl">
                  🤖
                </div>

                <div>
                  <h2 className="font-bold">
                    AI Co-Teacher
                  </h2>

                  <p className="text-xs text-blue-400">
                    Intelligent classroom assistant
                  </p>
                </div>

              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400">
                ● ONLINE
              </div>

            </div>

            {/* AI Body */}

            <div className="flex min-h-0 flex-1 flex-col p-5">

              <div className="rounded-2xl border border-white/5 bg-[#050b1d] p-4">

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Classroom Assistant
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Ask a question about the lesson and AI will explain it clearly.
                </p>

              </div>

              {/* AI answer */}

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-[#050b1d] p-5 pr-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">

                {aiLoading ? (
                  <div className="flex h-full min-h-[180px] items-center justify-center">

                    <div className="text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                        🤖
                      </div>

                      <p className="mt-3 text-sm text-slate-400">
                        AI is thinking...
                      </p>

                    </div>

                  </div>
                ) : aiError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
                    {aiError}
                  </div>
                ) : aiAnswer ? (
                  <div>

                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-400">
                      <span>🤖</span>
                      AI Co-Teacher
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                      {formatAIAnswer(aiAnswer)}
                    </div>

                  </div>
                ) : (
                  <div className="flex h-full min-h-[180px] items-center justify-center text-center">

                    <div>

                      <div className="text-4xl">
                        💡
                      </div>

                      <p className="mt-4 text-sm text-slate-400">
                        Ask something like:
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        "What is polymorphism in Java?"
                      </p>

                    </div>

                  </div>
                )}

              </div>

              {/* Question */}

              <div className="mt-4 flex shrink-0 gap-2">

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
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#050b1d] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60"
                />

                <button
                  onClick={askAI}
                  disabled={
                    aiLoading ||
                    !question.trim()
                  }
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {aiLoading
                    ? "..."
                    : "Ask"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            CONTROLS
        =================================================== */}

        <section className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-[#081124]/90 p-5 shadow-xl">

          <button
            onClick={toggleMic}
            className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
              micOn
                ? "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
                : "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            }`}
          >
            {micOn
              ? "🎤 Mic On"
              : "🔇 Mic Off"}
          </button>

          <button
            onClick={toggleCamera}
            className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
              cameraOn
                ? "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
                : "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            }`}
          >
            {cameraOn
              ? "📹 Camera On"
              : "📷 Camera Off"}
          </button>

          {role === "teacher" && (
            <button
              onClick={() => {
                if (isListening) {
                  stopSpeechRecognition();
                } else {
                  startSpeechRecognition();
                }
              }}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                isListening
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-purple-500/30 bg-purple-500/10 text-purple-300"
              }`}
            >
              {isListening
                ? "⏹ Stop Transcript"
                : "📝 Start Transcript"}
            </button>
          )}

          <button
            onClick={endClass}
            className="rounded-xl bg-red-600 px-7 py-3 text-sm font-bold shadow-lg shadow-red-600/10 transition hover:bg-red-500"
          >
            ⏹ End Class
          </button>

        </section>

        {/* ===================================================
            DIGITAL SMART BOARD
        =================================================== */}

        <section className="mt-7 overflow-hidden rounded-[26px] border border-blue-500/20 bg-[#081124]/95 shadow-2xl">

          {/* Board Header */}

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-xl">
                🖥️
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Digital Smart Board
                </h2>

                <p className="text-xs text-slate-500">
                  AI Powered Interactive Learning Board
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <input
                value={lessonTopic}
                onChange={(event) =>
                  setLessonTopic(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    generateBoard();
                  }
                }}
                placeholder="Enter lesson topic..."
                className="w-[210px] rounded-xl border border-white/10 bg-[#030918] px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />

              <button
                onClick={generateBoard}
                disabled={boardLoading || !lessonTopic.trim()}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {boardLoading
                  ? "Generating..."
                  : "Generate Board"}
              </button>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
                ● LIVE BOARD
              </div>

            </div>

          </div>

          {boardError && (
            <div className="mx-6 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300 md:mx-8">
              {boardError}
            </div>
          )}

          {/* Board Content */}

          <div className="p-5 md:p-8">

            <div className="rounded-[24px] border border-blue-400/10 bg-[#06101f] p-6 md:p-10">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                Current Lesson
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                {boardLesson.title}
              </h2>

              <p className="mt-3 text-sm text-slate-500 md:text-base">
                {boardLesson.subtitle}
              </p>

              {/* Lesson Cards */}

              <div className="mt-8 grid gap-5 lg:grid-cols-2">

                {/* What is variable */}

                <div className="rounded-2xl border border-white/10 bg-[#030a18] p-6">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                      01
                    </span>

                    <h3 className="text-lg font-bold">
                      {boardLesson.conceptTitle}
                    </h3>

                  </div>

                  <p className="mt-6 text-sm leading-7 text-slate-400">
                    {boardLesson.concept}
                  </p>

                </div>

                {/* Example */}

                <div className="rounded-2xl border border-white/10 bg-[#030a18] p-6">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
                      02
                    </span>

                    <h3 className="text-lg font-bold">
                      {boardLesson.exampleTitle}
                    </h3>

                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#020711] p-5 font-mono text-sm leading-8">

                    <pre className="whitespace-pre-wrap font-mono text-sm leading-8 text-cyan-300">
                      {boardLesson.example}
                    </pre>

                  </div>

                </div>

              </div>

              {/* Important Point */}

              <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                    💡
                  </div>

                  <div>

                    <h3 className="font-bold text-purple-300">
                      Important Point
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      {boardLesson.important}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            TRANSCRIPT + INSIGHTS
        =================================================== */}

        <section className="mt-7 grid gap-5 lg:grid-cols-2">

          {/* =================================================
              LIVE TRANSCRIPT
          ================================================= */}

          <div className="rounded-[24px] border border-purple-500/20 bg-[#081124]/95 p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/10 text-xl">
                  📝
                </div>

                <div>
                  <h2 className="font-bold">
                    Live Transcript
                  </h2>

                  <p className="text-xs text-slate-500">
                    Real-time speech to text
                  </p>
                </div>

              </div>

              <button
                onClick={clearTranscript}
                className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.1]"
              >
                Clear
              </button>

            </div>

            <div className="mt-5 min-h-[230px] rounded-2xl border border-white/5 bg-[#030918] p-5">

              {role === "teacher" ? (
                transcript ||
                interimTranscript ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">

                    {transcript}

                    {interimTranscript && (
                      <span className="text-slate-600">
                        {" "}
                        {interimTranscript}
                      </span>
                    )}

                  </p>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center text-center">

                    <div>

                      <div className="text-4xl">
                        🎙️
                      </div>

                      <p className="mt-4 text-sm text-slate-500">
                        Start speaking to generate the live transcript.
                      </p>

                    </div>

                  </div>
                )
              ) : (
                <div className="flex min-h-[200px] items-center justify-center text-center">

                  <div>

                    <div className="text-4xl">
                      👨‍🏫
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      Teacher transcript will appear here during the class.
                    </p>

                  </div>

                </div>
              )}

            </div>

            {role === "teacher" && (
              <p className="mt-3 text-[11px] text-slate-600">
                Speech recognition: English (India)
              </p>
            )}

          </div>

          {/* =================================================
              CLASSROOM INSIGHTS
          ================================================= */}

          <div className="rounded-[24px] border border-cyan-500/20 bg-[#081124]/95 p-6 shadow-xl">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-xl">
                🧠
              </div>

              <div>
                <h2 className="font-bold">
                  Classroom Insights
                </h2>

                <p className="text-xs text-slate-500">
                  Smart learning environment
                </p>
              </div>

            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/5 bg-[#030918] p-5">

                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Connection
                </p>

                <p className="mt-4 font-bold text-emerald-400">
                  {joined
                    ? "Connected"
                    : "Connecting"}
                </p>

              </div>

              <div className="rounded-2xl border border-white/5 bg-[#030918] p-5">

                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Participants
                </p>

                <p className="mt-4 font-bold text-cyan-400">
                  {remoteUser
                    ? "2 Active"
                    : "1 Active"}
                </p>

              </div>

              <div className="rounded-2xl border border-white/5 bg-[#030918] p-5">

                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Microphone
                </p>

                <p className="mt-4 font-bold text-purple-400">
                  {micOn
                    ? "Active"
                    : "Muted"}
                </p>

              </div>

              <div className="rounded-2xl border border-white/5 bg-[#030918] p-5">

                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Camera
                </p>

                <p className="mt-4 font-bold text-blue-400">
                  {cameraOn
                    ? "Active"
                    : "Off"}
                </p>

              </div>

            </div>

            <div className="mt-4 rounded-2xl border border-blue-500/10 bg-blue-500/[0.05] p-5">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                AI Classroom
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Agora connects the classroom in real time, while the AI Co-Teacher helps explain concepts and answer questions.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            CLASS STATUS
        =================================================== */}

        <section className="mt-7 rounded-[24px] border border-blue-500/20 bg-[#081124]/95 p-5 shadow-xl">

          <div className="flex flex-wrap items-center justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  🏫
                </div>

                <div>

                  <h3 className="font-bold">
                    Classroom Status
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {role === "teacher"
                      ? "You are hosting the live classroom."
                      : "You are attending the live classroom."}
                  </p>

                </div>

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-400">
                👥{" "}
                {remoteUser
                  ? "2 Participants"
                  : "Waiting for participant"}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-400">
                {micOn
                  ? "🎤 Mic Active"
                  : "🔇 Mic Off"}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-400">
                {cameraOn
                  ? "📹 Camera Active"
                  : "📷 Camera Off"}
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold text-blue-400">
                🌐 Agora RTC
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-10 mt-8 border-t border-white/10 bg-[#030817]/80">

        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-8">

          <p className="text-xs font-bold tracking-[0.25em] text-slate-600">
            AGORA CLASSROOM
          </p>

          <p className="text-xs text-slate-600">
            Real-Time Communication • AI Powered Learning
          </p>

          <p className="text-xs text-slate-600">
            Powered by Agora
          </p>

        </div>

      </footer>

    </div>
  );
}