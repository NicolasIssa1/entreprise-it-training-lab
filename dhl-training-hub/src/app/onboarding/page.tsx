"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { toggleButtonClass } from "@/lib/ui";
import { useOnboardingPreferences } from "@/lib/onboarding";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { getAssignmentById } from "@/lib/data/assignments";
import { ONBOARDING_EXPERIENCE_LEVELS, ONBOARDING_FOCUS_AREAS, ONBOARDING_GOALS, OnboardingExperience, OnboardingFocusArea, OnboardingGoal } from "@/lib/types";

/**
 * Lightweight onboarding flow (Phase 9 Part P/Q) — three questions, a
 * deterministic focus-area -> assignment mapping (lib/onboarding.ts), no AI
 * personalization. Only goal/focus area/experience are stored; nothing about
 * employer, salary, age, or other private profile data is collected.
 */
export default function OnboardingPage() {
  const { preferences, savePreferences, resetPreferences } = useOnboardingPreferences();
  const { selectAssignment } = useSelectedAssignment();

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<OnboardingGoal | null>(preferences.goal);
  const [focusArea, setFocusArea] = useState<OnboardingFocusArea | null>(preferences.focusArea);
  const [experience, setExperience] = useState<OnboardingExperience | null>(preferences.experience);

  const recommendedId = preferences.completed ? preferences.recommendedAssignmentId : null;
  const recommendedAssignment = recommendedId ? getAssignmentById(recommendedId) : undefined;

  function handleSubmit() {
    if (!goal || !focusArea || !experience) return;
    savePreferences(goal, focusArea, experience);
  }

  function handleActivate() {
    if (recommendedId) selectAssignment(recommendedId);
  }

  function startOver() {
    resetPreferences();
    setGoal(null);
    setFocusArea(null);
    setExperience(null);
    setStep(0);
  }

  if (preferences.completed && recommendedAssignment) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">You&rsquo;re set up</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Based on your answers, here&rsquo;s a suggested starting point.</p>
        </div>

        <Card>
          <SectionHeading title="Suggested Training Assignment" subtitle={recommendedAssignment.title} />
          <p className="text-sm text-slate-700 dark:text-slate-300">{recommendedAssignment.purpose}</p>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{recommendedAssignment.estimatedScope}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleActivate}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Activate this assignment
            </button>
            <Link
              href="/assignments"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              See all assignment templates
            </Link>
          </div>
        </Card>

        <Card>
          <SectionHeading title="Your answers" />
          <dl className="grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Goal</dt>
              <dd className="text-slate-800 dark:text-slate-200">{preferences.goal}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Focus area</dt>
              <dd className="text-slate-800 dark:text-slate-200">{preferences.focusArea}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Experience</dt>
              <dd className="text-slate-800 dark:text-slate-200">{preferences.experience}</dd>
            </div>
          </dl>
          <button onClick={startOver} className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Start over →
          </button>
        </Card>
      </div>
    );
  }

  const steps: { title: string; content: React.ReactNode }[] = [
    {
      title: "What brings you here?",
      content: (
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_GOALS.map((g) => (
            <button key={g} onClick={() => setGoal(g)} aria-pressed={goal === g} className={toggleButtonClass(goal === g)}>
              {g}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your focus area?",
      content: (
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_FOCUS_AREAS.map((f) => (
            <button key={f} onClick={() => setFocusArea(f)} aria-pressed={focusArea === f} className={toggleButtonClass(focusArea === f)}>
              {f}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your experience level?",
      content: (
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_EXPERIENCE_LEVELS.map((e) => (
            <button key={e} onClick={() => setExperience(e)} aria-pressed={experience === e} className={toggleButtonClass(experience === e)}>
              {e}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const stepValid = [!!goal, !!focusArea, !!experience];
  const canGoNext = stepValid[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          A few quick questions to suggest a starting Training Assignment — you can change it any time.
        </p>
      </div>

      <Disclaimer>
        Only your goal, focus area, and experience level are stored, purely on this device — no employer, salary, age,
        or other personal profile data is collected.
      </Disclaimer>

      <Card>
        <SectionHeading title={`Step ${step + 1} of ${steps.length}: ${steps[step].title}`} />
        {steps[step].content}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back
          </button>
          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canGoNext}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              See my suggested assignment
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={!canGoNext}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
