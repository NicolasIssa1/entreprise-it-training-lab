"use client";

import { useState } from "react";
import { LearningSection } from "@/components/LearningSection";
import { LearningPracticeScenario } from "@/lib/types";

/**
 * One fictional scenario + question + reveal-guidance. Deliberately not scored or
 * quiz-mechanic-driven — that's Phase 4 scope, not this.
 */
export function PracticeScenario({ scenario, question, guidance }: LearningPracticeScenario) {
  const [revealed, setRevealed] = useState(false);

  return (
    <LearningSection title="Practice scenario" subtitle="A realistic fictional situation — not a scored quiz">
      <p className="text-sm text-slate-700 dark:text-slate-300">{scenario}</p>
      <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">{question}</p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Reveal guidance
        </button>
      ) : (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          {guidance}
        </div>
      )}
    </LearningSection>
  );
}
