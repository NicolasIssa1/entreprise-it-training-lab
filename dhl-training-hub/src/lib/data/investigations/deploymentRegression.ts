import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL applications, deployments, or data. See root CLAUDE.md.
export const deploymentRegressionScenario: InvestigationScenario = {
  id: "deployment-regression",
  title: "An Application Starts Failing Right After a Deployment",
  description:
    "An app breaks immediately after a scheduled change — use the deployment timeline and logs to confirm correlation before recommending a rollback.",
  difficulty: "Intermediate",
  estimatedMinutes: 13,
  initialReport:
    "Shortly after this morning's scheduled deployment, employees report that submitting expense reports in the internal expenses application now fails with a generic error, though other parts of the app still work.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "Every employee trying to submit an expense report today is blocked — a narrow-looking symptom (\"submission fails\") can still be a wide business impact once you account for everyone who needs that one function.",
  relatedTopicIds: ["deployment-release", "application-logs", "change-management", "root-cause-analysis"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Correlate a new failure with a deployment timeline before assuming another cause.",
    "Use application logs to confirm what's actually failing, not just that something is.",
    "Understand a rollback/hotfix as a fast mitigation, distinct from a redesign.",
    "Document a regression clearly enough that it can be verified and prevented from recurring.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "application",
  topicsToReview: ["deployment-release", "root-cause-analysis", "change-management"],
  modelDocumentation: {
    issueSummary: "Expense report submission began failing with a generic error shortly after a scheduled deployment to the expenses application; other parts of the app kept working.",
    scopeImpact: "Every employee attempting to submit an expense report today — a department-wide, function-specific impact.",
    evidenceGathered: "Deployment completed at 08:45; first failure report came in at 08:52. Application logs showed an unhandled exception on every submission attempt starting at 08:52, referencing a field the deployment notes confirmed was renamed as part of a data-model cleanup.",
    likelyCause: "A field renamed in this morning's deployment broke the expense-submission flow, which still referenced the old field name.",
    actionTaken: "Escalated to Applications recommending a rollback or hotfix, with the timeline, log, and deployment-notes evidence.",
    escalation: "Escalated to Applications, who own the deployment.",
    verification: "Had employees test submitting an expense report after the hotfix to confirm it worked.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Shortly after this morning's scheduled deployment, employees report expense report submission fails with a generic error. Other parts of the app still work.",
      diagnosticQuestions: [
        { id: "q-scope", question: "Is everyone affected, or just some people?", answer: "Every employee who has tried to submit an expense report today has hit it; viewing past reports and editing a profile still work fine." },
        { id: "q-worked-before", question: "Did this work before?", answer: "Yes — submitting expense reports worked fine as of yesterday." },
        { id: "q-exact-error", question: "What exact error appears?", answer: "A generic \"Something went wrong, please try again\" message, with no further detail shown to users." },
        { id: "q-recent-change", question: "Did anything change recently?", answer: "There was a scheduled deployment to the expenses application early this morning." },
      ],
      actions: [
        {
          id: "check-timeline",
          label: "Check exactly when this morning's deployment happened relative to the first failure reports",
          description: "Establish whether the timing actually lines up.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — a precise timeline is what turns \"it happened around the same time as the deployment\" into actual evidence of a correlation.",
          nextNodeId: "timeline-checked",
        },
        {
          id: "tell-users-retry",
          label: "Tell users to keep retrying the submission",
          description: "Assume it might work on a later attempt.",
          stage: "resolve",
          quality: "weak",
          feedback: "Users are already retrying and hitting the same generic error every time — asking them to keep retrying doesn't investigate anything and just wastes their time.",
          nextNodeId: "start",
        },
      ],
    },

    "timeline-checked": {
      id: "timeline-checked",
      prompt: "You check the deployment and failure timeline.",
      evidence: [
        "Fictional training evidence: the deployment completed at 08:45 this morning.",
        "The first failure report came in at 08:52 — seven minutes after the deployment finished.",
      ],
      actions: [
        { id: "check-logs", label: "Check the application logs around the time of the failures", description: "Confirm exactly what's failing.", stage: "evidence", quality: "strong", feedback: "Exactly right — the timeline suggests a correlation, and the logs will confirm what's actually breaking.", nextNodeId: "logs-checked" },
        { id: "check-deployment-notes", label: "Check what this morning's deployment actually changed", description: "Look at the change list itself.", stage: "evidence", quality: "strong", feedback: "Also strong — the change list can tell you exactly what might explain a new failure in this specific flow.", nextNodeId: "deployment-notes-checked" },
      ],
    },

    "logs-checked": {
      id: "logs-checked",
      prompt: "You check the application logs.",
      evidence: [
        "Fictional training evidence: an unhandled exception occurs on every expense-report submission attempt, starting right at 08:52.",
        "The exception references a field that — per the deployment notes — was renamed.",
      ],
      actions: [
        { id: "check-deployment-notes-2", label: "Check the deployment notes for that renamed field", description: "Confirm the change that explains the exception.", stage: "evidence", quality: "strong", feedback: "Good — connecting the exact exception to a specific documented change makes this airtight.", nextNodeId: "deployment-notes-checked" },
        { id: "proceed-from-logs", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a precise timeline plus a matching exception is a clear, specific finding.", nextNodeId: "hub" },
      ],
    },

    "deployment-notes-checked": {
      id: "deployment-notes-checked",
      prompt: "You check what the deployment actually changed.",
      evidence: [
        "Fictional training evidence: the change list shows a renamed field in the expense-submission form, part of a data-model cleanup.",
        "No other changes in this deployment touch the expense-submission flow.",
      ],
      actions: [
        { id: "check-logs-2", label: "Check the application logs to confirm this is what's actually failing", description: "Verify the change matches the symptom.", stage: "evidence", quality: "strong", feedback: "Good — confirming the logs actually reference this field makes the correlation certain rather than just plausible.", nextNodeId: "logs-checked" },
        { id: "proceed-from-notes", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — the renamed field is a strong lead on its own, though confirming it in the logs would remove any doubt.", nextNodeId: "hub" },
        { id: "assume-database", label: "Assume this is a database problem", description: "Guess at an unrelated cause.", stage: "diagnose", quality: "weak", feedback: "Nothing here points to the database itself — the exception is tied to a specific renamed field from this morning's deployment, not a database connectivity or performance issue.", nextNodeId: "deployment-notes-checked" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You have a precise timeline correlation, a matching log exception, and a specific documented change that explains it. Decide how to proceed.",
      actions: [
        {
          id: "escalate-recommend-rollback",
          label: "Escalate to Applications recommending a rollback or hotfix of the renamed-field change, with the evidence",
          description: "Hand off with a specific, actionable recommendation.",
          stage: "escalate",
          quality: "strong",
          feedback: "Strong — a precise timeline, a matching exception, and a named change give Applications exactly what they need to roll back or hotfix quickly.",
          nextNodeId: "post-escalate",
        },
        {
          id: "wait-for-next-release",
          label: "Wait for the next scheduled release cycle to fix it",
          description: "Let the normal release process handle it eventually.",
          stage: "resolve",
          quality: "weak",
          feedback: "Expense report submission is fully broken for every employee right now — waiting for the next scheduled release leaves everyone blocked far longer than necessary when a rollback or hotfix is available.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"the expenses app has been broken since the deployment\"",
          description: "Hand off without the specific evidence.",
          stage: "escalate",
          quality: "weak",
          feedback: "You already traced this to a specific renamed field — leaving that out means Applications has to redo your investigation before they can act.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "tell-users-clear-cache",
          label: "Tell users to clear their browser cache",
          description: "Suggest a client-side fix.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "The error is a server-side unhandled exception tied to a renamed field — a browser cache has nothing to do with causing or fixing it.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate recommending a rollback or hotfix with your evidence. Applications confirms the renamed field broke the submission flow and deploys a hotfix correcting it.",
      evidence: ["Fictional training evidence: Applications confirms a hotfix has been deployed correcting the renamed-field issue."],
      actions: [
        { id: "verify-resolve", label: "Have a few employees test submitting an expense report to confirm it works", description: "Check the hotfix actually fixed the flow.", stage: "verify", quality: "strong", feedback: "This confirms the hotfix actually restored the flow end-to-end, not just that a deployment happened.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify", label: "Close the ticket as soon as Applications says the hotfix is deployed", description: "Trust the fix without checking.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were excellent — the missing step is having someone actually test the submission flow before closing.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You correlated the failure with the deployment timeline, confirmed it in the logs and change notes, escalated with a specific recommendation, and verified the hotfix actually restored the flow.",
        escalatedTeam: "applications",
        modelResolution: "A precise timeline correlation → confirmed by a matching log exception and a specific renamed-field change → escalating with a concrete rollback/hotfix recommendation sped up the fix → testing the actual submission flow confirmed it was really fixed, not just deployed.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You correctly traced the regression to a specific deployment change and escalated with strong evidence, but closed the ticket without confirming the hotfix actually restored the submission flow.",
        escalatedTeam: "applications",
        modelResolution: "The root-cause analysis and escalation were excellent. Having someone actually test the flow after the hotfix — rather than trusting the deployment alone — is what confirms the regression is truly gone.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated to the right team, but without the timeline, log, and change-notes evidence, so they have to re-diagnose the regression before they can fix it.",
        escalatedTeam: "applications",
        modelResolution: "The timeline correlation and the specific renamed field are exactly what makes a regression escalation actionable — naming the symptom without that evidence wastes the investigation you already did.",
      },
    },
  },
};
