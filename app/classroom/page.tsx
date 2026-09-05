"use client";

import { useSearchParams } from "next/navigation";
import LiveClassroom from "@/components/classroom/LiveClassroom";

export default function ClassroomPage() {
  const searchParams = useSearchParams();

  const role = searchParams.get("role") === "student"
    ? "student"
    : "teacher";

  return <LiveClassroom role={role} />;
}