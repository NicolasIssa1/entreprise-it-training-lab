"use client";

import { useLocalStorageState } from "@/lib/storage";
import { OnboardingExperience, OnboardingFocusArea, OnboardingGoal, OnboardingPreferences } from "@/lib/types";

const STORAGE_KEY = "onboarding-preferences";

const INITIAL: OnboardingPreferences = {
  completed: false,
  goal: null,
  focusArea: null,
  experience: null,
  recommendedAssignmentId: null,
};

const isPreferences = (value: unknown): value is OnboardingPreferences =>
  typeof value === "object" && value !== null && "completed" in value;

/** Deterministic focus-area -> assignment mapping (Phase 9 Part P/Q — "no
 * complex personalization AI, deterministic mappings only"). Focus area is the
 * primary driver since it maps most directly onto an assignment's subject
 * matter; goal/experience are recorded for context (and for the Tutor, see
 * lib/ai/useTutorProgressSummary.ts) but don't change the recommendation. */
const FOCUS_AREA_ASSIGNMENT: Record<OnboardingFocusArea, string> = {
  "IT Support": "enterprise-it-intern-foundation",
  Infrastructure: "infrastructure-network-foundation",
  Networking: "infrastructure-network-foundation",
  Applications: "applications-support-foundation",
  Security: "enterprise-it-intern-foundation",
  "Business & Logistics": "business-logistics-technology-foundation",
  "Not sure": "enterprise-it-intern-foundation",
};

export function recommendAssignmentId(focusArea: OnboardingFocusArea): string {
  return FOCUS_AREA_ASSIGNMENT[focusArea];
}

/**
 * Minimal onboarding preferences (Phase 9 Part P/Q) — goal, focus area,
 * experience level, and the deterministically recommended assignment id.
 * Stored purely in localStorage, same simple pattern as assignment selection;
 * no employer, salary, age, or other private profile data is ever collected.
 */
export function useOnboardingPreferences() {
  const { state, setState, loaded } = useLocalStorageState<OnboardingPreferences>(STORAGE_KEY, INITIAL, isPreferences);

  function savePreferences(goal: OnboardingGoal, focusArea: OnboardingFocusArea, experience: OnboardingExperience) {
    const recommendedAssignmentId = recommendAssignmentId(focusArea);
    setState({ completed: true, goal, focusArea, experience, recommendedAssignmentId });
    return recommendedAssignmentId;
  }

  function resetPreferences() {
    setState(INITIAL);
  }

  return { preferences: state, savePreferences, resetPreferences, loaded };
}
