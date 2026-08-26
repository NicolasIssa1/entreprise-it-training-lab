"use client";

import { Suspense } from "react";
import { TutorChat } from "@/components/TutorChat";

export default function TutorPage() {
  return (
    <Suspense fallback={null}>
      <TutorChat />
    </Suspense>
  );
}
