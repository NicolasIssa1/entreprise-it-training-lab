import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, employees, or data. See root CLAUDE.md.
export const previouslyWorkingFlowFailsScenario: InvestigationScenario = {
  id: "previously-working-flow-fails",
  title: "Previously Working Flow Suddenly Fails",
  description:
    "A Power Automate flow that ran reliably for over a year suddenly fails on every run, with no logic changes made to it. Practice tracing an automation failure back to a governance/ownership gap rather than a logic bug.",
  difficulty: "Intermediate",
  estimatedMinutes: 13,
  initialReport:
    "A flow that processes daily approval requests and has run reliably for over a year has failed on every single run for the past several days. Nobody who currently supports it made any changes to the flow itself.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "Initial reports treat this as \"the flow is broken,\" but a flow that fails on every run after over a year of reliability is worth scoping carefully — this could point to something bigger than the flow itself.",
  relatedTopicIds: ["connectors-and-data-sources", "automation-governance-and-ownership", "troubleshooting-a-broken-flow", "common-power-automate-failure-patterns"],
  likelyTeams: ["applications", "infrastructure"],
  learningObjectives: [
    "Apply the troubleshooting-a-broken-flow framework to a flow with no recent logic changes.",
    "Recognize an authentication/connection failure pattern versus a logic bug.",
    "Trace a technical failure back to a governance root cause: an automation tied to one person's account.",
    "Choose a fix that prevents recurrence, not just one that gets the flow running again today.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "authentication",
  topicsToReview: ["connectors-and-data-sources", "automation-governance-and-ownership", "troubleshooting-a-broken-flow"],
  modelDocumentation: {
    issueSummary: "A flow that had run reliably for over a year began failing on every run, several days ago, with no changes made to the flow's own logic.",
    scopeImpact: "Every run since a specific date failed at the same step — not an intermittent or partial failure, and not limited to specific input data.",
    evidenceGathered: "Run History showed every failing run stopping at the same action, with a permission/authentication-style error. That action's connection was authenticated under the account of an employee who had recently left the organization; the connection had stopped working once that account was disabled.",
    likelyCause: "The flow's connection to that step's service was tied to a personal account that no longer had access, rather than any change to the flow's own configuration or logic.",
    actionTaken: "Re-authenticated the failing action's connection under a shared/service account rather than another individual's personal account, and confirmed the flow's other actions and logic were unaffected.",
    escalation: "Raised with the team responsible for account/access management to set up a proper shared service account for this flow's connections going forward, rather than relying on an individual's personal login.",
    verification: "Re-ran the flow manually and confirmed it completed successfully end-to-end, then monitored the next several scheduled runs to confirm the fix held.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the report. A daily approval-processing flow that has run reliably for over a year has failed on every run for several days straight. Nobody who currently supports the flow made any recent changes to it.",
      diagnosticQuestions: [
        { id: "q-when", question: "When exactly did the failures start?", answer: "The first failed run was about a week ago; every run since has also failed." },
        { id: "q-changes", question: "Was anything about the flow itself changed recently?", answer: "Not according to anyone currently on the team — no one recalls editing its logic." },
        { id: "q-org-changes", question: "Was there any other change around that time — staffing, accounts, permissions?", answer: "An employee who used to help maintain some of the team's automations left the organization roughly around when the failures started." },
        { id: "q-partial", question: "Does the flow fail completely, or only for some input?", answer: "It fails on every run, at what appears to be the same point each time — not just for specific requests." },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Confirm the failure is happening on every run, at the same step, rather than intermittently",
          description: "Establish the exact failure pattern before assuming a cause.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — a consistent failure at the same step, every time, points toward something structural (like a broken dependency), rather than a data-specific edge case.",
          nextNodeId: "scope-checked",
        },
        {
          id: "assume-logic-regression",
          label: "Assume someone must have changed the flow's logic and start comparing old screenshots of it",
          description: "Focus entirely on the flow's own configuration first.",
          stage: "diagnose",
          quality: "weak",
          feedback: "This isn't unreasonable to check eventually, but jumping straight to a logic comparison, before looking at what actually failed in Run History, risks spending time on the wrong hypothesis first.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-checked": {
      id: "scope-checked",
      prompt: "You confirm the failure pattern across several recent runs.",
      evidence: [
        "Every run in the past week has failed, with no successful runs since the first failure.",
        "Every failure appears to stop at the same point in the flow, regardless of which specific request it was processing.",
      ],
      actions: [
        {
          id: "check-run-history",
          label: "Open Run History and inspect exactly which action fails and what error it returns",
          description: "Find the specific failing step and its actual error.",
          stage: "evidence",
          quality: "strong",
          feedback: "Exactly the right move — this is the framework's core step: find the specific failing step and inspect it, rather than guessing at the whole flow.",
          nextNodeId: "run-history-checked",
        },
        {
          id: "guess-data-issue",
          label: "Assume the source data suddenly became invalid across every request",
          description: "Treat this as an input-quality problem.",
          stage: "diagnose",
          quality: "weak",
          feedback: "It would be unusual for every single request, across a full week, to independently have bad data at the exact same point — this is worth checking, but Run History's actual error message should be reviewed first.",
          nextNodeId: "scope-checked",
        },
      ],
    },

    "run-history-checked": {
      id: "run-history-checked",
      prompt: "You inspect Run History for several of the failed runs.",
      evidence: [
        "Every failed run stops at the same action — one that connects to an external service as part of the approval process.",
        "The error returned is permission/authentication-style, not a data-validation or logic error.",
      ],
      actions: [
        {
          id: "check-connection-health",
          label: "Check the health and ownership of that action's connection",
          description: "Look at what account the connection is authenticated under.",
          stage: "evidence",
          quality: "strong",
          feedback: "Right instinct — a permission/authentication-style error pointing at one specific action strongly suggests a broken connection, not a flow logic problem.",
          nextNodeId: "connection-checked",
        },
        {
          id: "proceed-from-runhistory",
          label: "You have enough evidence — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "reasonable",
          feedback: "You have a strong lead already — a permission-style error at one step — though confirming the connection's actual ownership would make the fix more precise.",
          nextNodeId: "hub",
        },
      ],
    },

    "connection-checked": {
      id: "connection-checked",
      prompt: "You check the connection used by the failing action.",
      evidence: [
        "The connection is authenticated under the personal account of the employee who recently left the organization.",
        "That account was disabled around the same time the flow's failures began, which lines up exactly with the timing.",
      ],
      actions: [
        {
          id: "proceed-to-hub",
          label: "You have a clear, evidenced cause — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "strong",
          feedback: "Strong — you've traced this precisely to a connection tied to a now-disabled personal account, with timing that matches exactly.",
          nextNodeId: "hub",
        },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You know the flow's own logic never changed — the failing action's connection was authenticated under a former employee's account, which was disabled around when the failures began. Decide how to proceed.",
      actions: [
        {
          id: "fix-shared-account",
          label: "Re-authenticate the connection under a shared/service account rather than an individual's personal login",
          description: "Fix the immediate failure and remove the single-person dependency.",
          stage: "resolve",
          quality: "strong",
          feedback: "This is the strongest fix — it restores the flow now and removes the exact fragility that caused the failure in the first place, so it won't recur the next time an individual's account changes.",
          nextNodeId: "post-resolve-shared",
        },
        {
          id: "fix-own-account",
          label: "Quickly re-authenticate the connection under your own personal account so the flow starts working again",
          description: "Get the flow running again as fast as possible.",
          stage: "resolve",
          quality: "reasonable",
          feedback: "This does get the flow running again immediately, but it just moves the same fragility onto a different individual's account — the same failure will likely recur later under your name instead.",
          nextNodeId: "post-resolve-own",
        },
        {
          id: "workaround-manual-approvals",
          label: "Ask the team to process approvals manually until someone eventually gets to fixing the flow",
          description: "Avoid touching the flow's connection.",
          stage: "resolve",
          quality: "weak",
          feedback: "This restores the process but leaves the actual automation broken and unaddressed — worth doing only as a very short-term stopgap, not as the resolution itself.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-account-governance",
          label: "Escalate to raise setting up a proper shared service account for this flow's connections, since this is a recurring risk pattern",
          description: "Address the governance gap, not just this one flow.",
          stage: "escalate",
          quality: "reasonable",
          feedback: "A reasonable and thorough move — if this flow depended on one person's account, other automations this team maintains might have the same risk, worth surfacing beyond just this one fix.",
          nextNodeId: "post-escalate",
        },
      ],
    },

    "post-resolve-shared": {
      id: "post-resolve-shared",
      prompt: "You re-authenticate the failing action's connection under a shared/service account rather than an individual's personal login.",
      evidence: ["Fictional training evidence: the connection now shows as healthy and authenticated under the shared account, not tied to any one person."],
      actions: [
        { id: "verify-shared", label: "Manually re-run the flow end-to-end and confirm it completes successfully", description: "Check the fix actually resolved the failure.", stage: "verify", quality: "strong", feedback: "This confirms the fix works in practice, not just that the connection shows as \"connected\" in its settings.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-shared", label: "Assume re-authenticating was sufficient without re-running the flow", description: "Skip the end-to-end confirmation.", stage: "verify", quality: "weak", feedback: "The fix is very likely correct, but skipping a real end-to-end run means you haven't actually confirmed the whole flow completes successfully again — only that one connection now shows as healthy.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "post-resolve-own": {
      id: "post-resolve-own",
      prompt: "You re-authenticate the connection under your own personal account, and the flow starts completing runs successfully again.",
      evidence: ["Fictional training evidence: the flow now runs successfully, authenticated under your own personal account."],
      actions: [
        { id: "verify-own", label: "Confirm the flow runs successfully, and flag that this connection is still tied to one individual's account for a future proper fix", description: "Verify the immediate fix while noting the remaining risk.", stage: "verify", quality: "reasonable", feedback: "Good that you're flagging the remaining risk — the flow works again, but it's still one person's account away from failing the same way in the future, worth revisiting properly.", nextNodeId: "outcome-resolved-own-flagged" },
        { id: "skip-verify-own", label: "Consider this fully resolved now that the flow runs again", description: "Treat the personal-account fix as the final answer.", stage: "verify", quality: "weak", feedback: "The flow works again, but treating this as fully resolved misses that the same fragile pattern — one person's account — is still in place and will likely cause the same failure again eventually.", nextNodeId: "outcome-resolved-own-unflagged" },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt: "You escalate with the specific evidence: this flow's connection was tied to a departed employee's personal account, and this may be a broader pattern worth addressing with proper service accounts.",
      evidence: ["Fictional training evidence: the team responsible for account management sets up a shared service account, and the flow's connections are migrated to it."],
      actions: [
        { id: "verify-escalate", label: "Follow up to confirm the flow now runs successfully under the new shared account", description: "Close the loop rather than assuming the escalation was handled.", stage: "verify", quality: "strong", feedback: "Following up rather than assuming the migration was completed and correct is what actually confirms this is resolved, not just requested.", nextNodeId: "outcome-escalated-verified" },
        { id: "skip-verify-escalate", label: "Consider it done once escalated, without following up", description: "Move on without confirming the outcome.", stage: "verify", quality: "weak", feedback: "Your diagnosis and escalation were strong, but without following up, you can't be sure the flow is actually running again or that the new account was set up correctly.", nextNodeId: "outcome-escalated-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You traced a total flow failure back to a connection tied to a departed employee's personal account, fixed it durably with a shared service account, and verified the flow works end-to-end.",
        modelResolution: "Confirming every run failed at the same step ruled out a data-specific cause → inspecting Run History's actual error pointed to authentication → checking the connection's ownership found it tied to a now-disabled personal account → fixing it with a shared service account removed the fragility rather than just moving it → verifying with a real end-to-end run confirmed it.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You correctly diagnosed the broken connection and fixed it durably with a shared account, but didn't re-run the flow end-to-end to confirm.",
        modelResolution: "The diagnosis and fix were correct — the missing step was a real end-to-end run to confirm the whole flow, not just the connection's status, actually works again.",
      },
    },
    "outcome-resolved-own-flagged": {
      id: "outcome-resolved-own-flagged",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You got the flow running again quickly under your own account and explicitly flagged the remaining single-person-account risk for a proper fix.",
        modelResolution: "This restores service immediately, and flagging the remaining risk is the right instinct — though a shared service account, set up directly, would have resolved both the immediate failure and the underlying fragility in one step.",
      },
    },
    "outcome-resolved-own-unflagged": {
      id: "outcome-resolved-own-unflagged",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "weak",
        summary: "You got the flow running again under your own personal account, but treated that as fully resolved without addressing the underlying single-person-account fragility.",
        modelResolution: "The flow works today, but the exact same failure pattern is now waiting to happen again the next time your account changes — the underlying governance gap was never actually closed.",
      },
    },
    "outcome-escalated-verified": {
      id: "outcome-escalated-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You correctly diagnosed the connection failure, escalated it as a broader governance risk, and followed up to confirm the flow was migrated to a proper shared account and works again.",
        modelResolution: "Recognizing this as a governance pattern — not just a one-flow fix — and escalating it, then confirming the outcome, addresses both the immediate failure and the risk of it recurring elsewhere.",
        escalatedTeam: "infrastructure",
      },
    },
    "outcome-escalated-unverified": {
      id: "outcome-escalated-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "Your diagnosis and escalation were strong, but without a follow-up, you can't be sure the flow was actually restored.",
        modelResolution: "The diagnostic work here was excellent — the missing step was confirming the outcome after escalating, rather than assuming the handoff was sufficient.",
        escalatedTeam: "infrastructure",
      },
    },
  },
};
