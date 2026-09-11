"use client";

import { toggleButtonClass, inputClass } from "@/lib/ui";
import { HINT_LEVELS, HINT_LEVEL_LABELS, HintLevel, INTERVIEW_CATEGORIES, InterviewCategory, SKILL_IDS, TROUBLESHOOT_CATEGORIES, TroubleshootCategory, TutorMode } from "@/lib/types";
import { skillDefinitions } from "@/lib/data/skills";

/** The 7 direct, user-selectable modes (Phase 14) — "tutor" is reused/
 * relabeled "Explain" rather than duplicated (see types.ts's TUTOR_MODES
 * comment). Every other TutorMode value is a trusted-deep-link-only mode
 * and deliberately never appears here. */
const DIRECT_MODES: { mode: TutorMode; label: string; description: string }[] = [
  { mode: "tutor", label: "Explain", description: "Teach a concept clearly at your level" },
  { mode: "coach", label: "Coach", description: "Guide me through it, don't just tell me" },
  { mode: "quiz-me", label: "Quiz Me", description: "Adaptive practice questions" },
  { mode: "troubleshoot", label: "Troubleshoot", description: "Run a fictional IT incident scenario" },
  { mode: "project-mentor", label: "Project Mentor", description: "Plan or review a practical project" },
  { mode: "interview", label: "Interview", description: "A realistic mock interview" },
  { mode: "review", label: "Review", description: "Review my reasoning against a skill area" },
];

const TROUBLESHOOT_CATEGORY_LABELS: Record<TroubleshootCategory, string> = {
  dns: "DNS",
  authentication: "Authentication",
  networking: "Networking",
  "email-delivery": "Email delivery",
  permissions: "Permissions",
  endpoint: "Endpoint issue",
  "cloud-availability": "Cloud/service availability",
  "automation-workflow": "Automation workflow failure",
};

const INTERVIEW_CATEGORY_LABELS: Record<InterviewCategory, string> = {
  "graduate-it": "Graduate software/IT",
  infrastructure: "Infrastructure",
  cybersecurity: "Cybersecurity",
  automation: "Enterprise automation",
  "applications-support": "Applications/support",
  "general-enterprise-it": "General enterprise IT",
};

export interface TutorModeSelectorProps {
  directMode: TutorMode;
  onDirectModeChange: (mode: TutorMode) => void;
  troubleshootCategory: TroubleshootCategory | null;
  onTroubleshootCategoryChange: (category: TroubleshootCategory) => void;
  interviewCategory: InterviewCategory | null;
  onInterviewCategoryChange: (category: InterviewCategory) => void;
  hintLevel: HintLevel;
  onHintLevelChange: (level: HintLevel) => void;
  quizMeSkillId: string;
  onQuizMeSkillIdChange: (skillId: string) => void;
  disabled?: boolean;
}

/**
 * The direct mode picker shown when the learner opens /tutor without page
 * context (no linked topic/quiz/investigation/automation scenario) — those
 * deep-link entry points keep their exact Phase 6-9 behavior unchanged and
 * never show this picker (see TutorChat.tsx). Each mode shares the same
 * /api/tutor infrastructure; only the mode string and (for 4 of the 7) one
 * small session parameter differ — see lib/ai/tutorPrompt.ts.
 */
export function TutorModeSelector(props: TutorModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Tutor mode">
        {DIRECT_MODES.map(({ mode, label, description }) => (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={props.directMode === mode}
            title={description}
            onClick={() => props.onDirectModeChange(mode)}
            disabled={props.disabled}
            className={toggleButtonClass(props.directMode === mode)}
          >
            {label}
          </button>
        ))}
      </div>

      {props.directMode === "troubleshoot" && (
        <div className="flex flex-wrap gap-1.5">
          {TROUBLESHOOT_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => props.onTroubleshootCategoryChange(c)}
              disabled={props.disabled}
              className={toggleButtonClass(props.troubleshootCategory === c)}
            >
              {TROUBLESHOOT_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      )}

      {props.directMode === "interview" && (
        <div className="flex flex-wrap gap-1.5">
          {INTERVIEW_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => props.onInterviewCategoryChange(c)}
              disabled={props.disabled}
              className={toggleButtonClass(props.interviewCategory === c)}
            >
              {INTERVIEW_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      )}

      {props.directMode === "project-mentor" && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Hint level:</span>
          {HINT_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => props.onHintLevelChange(level)}
              disabled={props.disabled}
              className={toggleButtonClass(props.hintLevel === level)}
            >
              {level}. {HINT_LEVEL_LABELS[level]}
            </button>
          ))}
        </div>
      )}

      {props.directMode === "quiz-me" && (
        <select
          value={props.quizMeSkillId}
          onChange={(e) => props.onQuizMeSkillIdChange(e.target.value)}
          disabled={props.disabled}
          className={`${inputClass} w-auto`}
          aria-label="Quiz Me skill area"
        >
          <option value="">General / mixed</option>
          {SKILL_IDS.map((id) => (
            <option key={id} value={id}>
              {skillDefinitions.find((s) => s.id === id)?.name ?? id}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
