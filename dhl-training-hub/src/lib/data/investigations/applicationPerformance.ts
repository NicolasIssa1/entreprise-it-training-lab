import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, deployments, or data. See root CLAUDE.md.
export const applicationPerformanceScenario: InvestigationScenario = {
  id: "application-performance",
  title: "A Business Application Is Extremely Slow For Multiple Users",
  description:
    "Investigate a shared performance problem across application, database, and infrastructure layers — deliberately no single obvious cause.",
  difficulty: "Intermediate",
  estimatedMinutes: 15,
  initialReport:
    "Since mid-morning, employees across Operations and Finance say a core business application is \"unusably slow\" — pages that normally load instantly are now taking 10-20 seconds. No error messages, just slowness.",
  suggestedBusinessImpact: "Multiple departments",
  businessImpactNote:
    "Two departments reporting the identical symptom at the same time is a signal this is shared infrastructure or a shared application component, not an individual workstation problem.",
  relatedTopicIds: ["application-performance", "application-monitoring", "database", "capacity-performance", "deployment-release", "application-logs"],
  likelyTeams: ["applications", "infrastructure"],
  learningObjectives: [
    "Investigate a shared performance problem across multiple layers instead of guessing at one cause.",
    "Use monitoring, logs, and recent-change history as independent lines of evidence.",
    "Recognize when evidence genuinely points to more than one plausible cause.",
    "Escalate with the specific evidence you gathered, not just a generic description.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "application",
  topicsToReview: ["application-performance", "capacity-performance", "deployment-release", "escalation"],
  modelDocumentation: {
    issueSummary: "A core business application became extremely slow (10-20s page loads) for multiple departments starting mid-morning, with no error messages.",
    scopeImpact: "Employees across Operations and Finance — multiple departments, not one workstation or one person.",
    evidenceGathered: "Server hosting the application showed sustained ~95% CPU. Application logs showed a new deployment at 09:10 and a spike in slow-query warnings from the reporting/search pages starting at the same time. Specific queries tied to those pages were unusually slow; the database server itself looked healthy otherwise.",
    likelyCause: "Most likely an unindexed or inefficient query introduced by this morning's deployment, compounded by high server load.",
    actionTaken: "Escalated with the deployment-timing and slow-query evidence.",
    escalation: "Escalated to Applications (evidence pointed most specifically at a query introduced by a recent deployment) — Infrastructure's high-CPU evidence was also a defensible escalation target; exact ownership varies by organization.",
    verification: "Confirmed with affected employees that report/search pages returned to normal load times after the fix.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Since mid-morning, employees in two different departments say a core business application has become unusably slow — no errors, just long waits.",
      diagnosticQuestions: [
        { id: "q-anyone-unaffected", question: "Is everyone affected, or only some people?", answer: "Both Operations and Finance report it; a few people in other departments say the app feels normal for them." },
        { id: "q-when", question: "When exactly did this start?", answer: "Reports started mid-morning, roughly 09:15-09:30." },
        { id: "q-recent-change", question: "Did anything change recently?", answer: "One team lead mentions hearing a new version of the application went out this morning, but it's unconfirmed." },
        { id: "q-which-pages", question: "Does this happen on every page, or specific ones?", answer: "Pages that show reports or search results are the slowest; simple pages (like the login screen) feel normal." },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Confirm exactly who and which pages are affected",
          description: "Establish scope before investigating a cause.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — knowing it's specific pages, not the whole app, and specific departments, not everyone, already narrows things down.",
          nextNodeId: "scope-confirmed",
        },
        {
          id: "blame-wifi",
          label: "Tell the reporting employees to check their own Wi-Fi",
          description: "Assume it's a local connectivity issue.",
          stage: "resolve",
          quality: "weak",
          feedback: "Two whole departments reporting the identical symptom at the same time doesn't fit an individual Wi-Fi problem — it's a shared cause.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-confirmed": {
      id: "scope-confirmed",
      prompt: "You confirm the pattern: Operations and Finance are affected, specifically on pages showing reports or search results.",
      evidence: [
        "Employees across two departments are affected; a few users elsewhere report no issue.",
        "Reporting/search pages are slow; simple pages (e.g. login) load normally.",
      ],
      actions: [
        {
          id: "check-monitoring",
          label: "Check server monitoring for the application's host",
          description: "Look at resource usage on the server.",
          stage: "evidence",
          quality: "strong",
          feedback: "A solid independent line of evidence — resource exhaustion is a common cause of exactly this kind of widespread slowness.",
          nextNodeId: "server-resources",
        },
        {
          id: "check-app-logs",
          label: "Check the application logs for recent changes and errors",
          description: "Look for deployment markers and warnings.",
          stage: "evidence",
          quality: "strong",
          feedback: "Also strong — logs can confirm or rule out the rumored deployment and show you exactly which pages are struggling.",
          nextNodeId: "app-logs-checked",
        },
        {
          id: "check-database",
          label: "Check whether database queries are running slowly",
          description: "Investigate the data layer underneath the affected pages.",
          stage: "evidence",
          quality: "reasonable",
          feedback: "Reasonable, though checking monitoring or logs first would usually get you oriented faster before diving into query-level detail.",
          nextNodeId: "database-checked",
        },
        {
          id: "restart-app-server-blind",
          label: "Restart the application server right now, without checking anything first",
          description: "Try the fastest possible fix.",
          stage: "resolve",
          quality: "weak",
          feedback: "This might mask the symptom temporarily, but you won't know why it worked (if it does), you risk losing in-progress work for current users, and it teaches you nothing for next time.",
          nextNodeId: "scope-confirmed",
        },
      ],
    },

    "server-resources": {
      id: "server-resources",
      prompt: "You check monitoring for the server hosting the application.",
      evidence: [
        "CPU usage has been sustained around 95% for roughly the last 40 minutes.",
        "Memory usage looks normal.",
      ],
      actions: [
        { id: "also-check-logs-1", label: "Also check the application logs", description: "Look for a recent change.", stage: "evidence", quality: "strong", feedback: "Good — combining resource evidence with a logs/change check gives you a much stronger picture.", nextNodeId: "app-logs-checked" },
        { id: "also-check-db-1", label: "Also check database query performance", description: "Look at the data layer.", stage: "evidence", quality: "strong", feedback: "Good — this rules in or out whether the CPU load traces back to expensive queries.", nextNodeId: "database-checked" },
        { id: "proceed-from-resources", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — high CPU alone is real evidence, though checking one more layer would make your escalation harder to argue with.", nextNodeId: "hub" },
        { id: "kill-process-blind", label: "Kill the top CPU-consuming process without knowing what it is", description: "Try to relieve the load immediately.", stage: "resolve", quality: "weak", feedback: "Killing an unidentified process on a shared server risks breaking something unrelated entirely — identify what it is (or escalate to someone who can) before acting on it.", nextNodeId: "server-resources" },
      ],
    },

    "app-logs-checked": {
      id: "app-logs-checked",
      prompt: "You check the application logs.",
      evidence: [
        "A new version of the application was deployed at 09:10 this morning.",
        "Logs show a spike in slow-query warnings starting around the same time, all originating from the reporting/search pages.",
      ],
      actions: [
        { id: "also-check-resources-1", label: "Also check server resource usage", description: "See if this correlates with load.", stage: "evidence", quality: "strong", feedback: "Good — checking whether resource usage also spiked at deployment time strengthens the correlation.", nextNodeId: "server-resources" },
        { id: "also-check-db-2", label: "Also check database query performance", description: "Confirm which queries are slow.", stage: "evidence", quality: "strong", feedback: "Good — this confirms exactly which queries are involved, not just that warnings exist.", nextNodeId: "database-checked" },
        { id: "proceed-from-logs", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — the deployment-timing correlation is meaningful on its own, though one more check would make it stronger.", nextNodeId: "hub" },
        { id: "dismiss-deployment", label: "Assume it's unrelated to the deployment since there are no hard errors", description: "Rule out the deployment because nothing is actually broken.", stage: "diagnose", quality: "weak", feedback: "Performance regressions rarely throw errors — they just get slow. A deployment landing almost exactly when the slowdown started, on the exact pages affected, is a strong correlation worth taking seriously.", nextNodeId: "app-logs-checked" },
      ],
    },

    "database-checked": {
      id: "database-checked",
      prompt: "You check database performance for the affected pages.",
      evidence: [
        "Several queries tied to the reporting/search pages are taking far longer than normal to complete.",
        "The database server's own CPU and memory look normal — it's specific queries, not the whole database, that are slow.",
      ],
      actions: [
        { id: "also-check-resources-2", label: "Also check server resource usage", description: "See the bigger picture.", stage: "evidence", quality: "strong", feedback: "Good — combining this with server-level evidence rounds out the picture.", nextNodeId: "server-resources" },
        { id: "also-check-logs-2", label: "Also check the application logs", description: "Look for a recent change that could explain this.", stage: "evidence", quality: "strong", feedback: "Good — this is exactly how you'd find out whether a recent deployment introduced the slow query.", nextNodeId: "app-logs-checked" },
        { id: "proceed-from-db", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — specific slow queries on the affected pages is solid evidence on its own.", nextNodeId: "hub" },
        { id: "restart-database", label: "Restart the database server", description: "Try to clear whatever is causing the slowness.", stage: "resolve", quality: "weak", feedback: "The database server itself looks healthy — restarting it is unlikely to fix a slow-query problem and would disrupt everyone using it, including systems unrelated to this ticket.", nextNodeId: "database-checked" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You have gathered evidence across at least one layer. It's time to decide how to proceed.",
      actions: [
        {
          id: "escalate-apps",
          label: "Escalate to Applications, citing the deployment-timing and slow-query evidence",
          description: "Point to the correlation between the release and the new query pattern.",
          stage: "escalate",
          quality: "strong",
          feedback: "Strong — a deployment landing right when specific queries on specific pages got slow is a clear, actionable thread for Applications to pull on.",
          nextNodeId: "post-escalate-apps",
        },
        {
          id: "escalate-infra",
          label: "Escalate to Infrastructure, citing the sustained high CPU usage",
          description: "Point to the resource evidence on the host server.",
          stage: "escalate",
          quality: "strong",
          feedback: "Also strong — sustained 95% CPU across the exact window of the slowdown is hard, specific evidence Infrastructure can act on directly. Real investigations often have more than one defensible next step.",
          nextNodeId: "post-escalate-infra",
        },
        {
          id: "escalate-vague",
          label: "Escalate to Applications because they \"usually handle slow app tickets\"",
          description: "Hand it off based on habit rather than evidence.",
          stage: "escalate",
          quality: "weak",
          feedback: "Applications may well be the right team, but escalating without citing what you actually found forces them to redo the investigation you already did.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "wait-and-see",
          label: "Wait another hour to see if it resolves on its own",
          description: "Hold off on any action or communication.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "Two departments are already blocked from normal work — waiting silently isn't a neutral choice, it has a real business cost, and you already have evidence to act on.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-escalate-apps": {
      id: "post-escalate-apps",
      prompt:
        "You escalate to Applications with the deployment-timing and slow-query evidence. They report that this morning's release included a reporting-page query that wasn't properly indexed, and they've deployed a fix.",
      evidence: ["Fictional training evidence: Applications reports a fix has been deployed for the reporting-page query."],
      actions: [
        { id: "verify-apps", label: "Confirm with affected employees that report/search pages are fast again", description: "Check the fix actually worked.", stage: "verify", quality: "strong", feedback: "This confirms the fix actually solved the reported problem, not just that a deployment happened.", nextNodeId: "outcome-resolved-verified-apps" },
        { id: "skip-verify-apps", label: "Close the ticket as soon as Applications says it's fixed", description: "Trust the fix without checking.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were strong — skipping verification with the actual affected employees is the one gap here.", nextNodeId: "outcome-resolved-unverified-apps" },
      ],
    },

    "post-escalate-infra": {
      id: "post-escalate-infra",
      prompt:
        "You escalate to Infrastructure with the sustained-CPU evidence. They report the server was under unusually heavy load from a background process and have rebalanced it; performance has reportedly returned to normal.",
      evidence: ["Fictional training evidence: Infrastructure reports the server load has been rebalanced."],
      actions: [
        { id: "verify-infra", label: "Confirm with affected employees that the app feels normal again", description: "Check the fix actually worked.", stage: "verify", quality: "strong", feedback: "This confirms the fix actually solved the reported problem, not just that a change was made on the server.", nextNodeId: "outcome-resolved-verified-infra" },
        { id: "skip-verify-infra", label: "Close the ticket as soon as Infrastructure says it's rebalanced", description: "Trust the fix without checking.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were strong — skipping verification with the actual affected employees is the one gap here.", nextNodeId: "outcome-resolved-unverified-infra" },
      ],
    },

    "outcome-resolved-verified-apps": {
      id: "outcome-resolved-verified-apps",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You investigated multiple layers, escalated to Applications with specific deployment/query evidence, and verified the fix actually restored performance for affected employees.",
        escalatedTeam: "applications",
        modelResolution: "Scope narrowed this to specific pages/departments → checking logs surfaced a deployment correlated with new slow-query warnings → escalating with that specific evidence let Applications act immediately → verifying with affected employees confirmed the fix actually worked.",
      },
    },
    "outcome-resolved-unverified-apps": {
      id: "outcome-resolved-unverified-apps",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You investigated well and escalated to Applications with strong evidence, but closed the ticket without confirming with affected employees that the fix actually worked.",
        escalatedTeam: "applications",
        modelResolution: "The diagnosis and escalation were solid — the missing step was verifying with the people who originally reported the problem before closing.",
      },
    },
    "outcome-resolved-verified-infra": {
      id: "outcome-resolved-verified-infra",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You investigated multiple layers, escalated to Infrastructure with specific resource-usage evidence, and verified the fix actually restored performance for affected employees.",
        escalatedTeam: "infrastructure",
        modelResolution: "Scope narrowed this to specific pages/departments → checking server monitoring surfaced sustained high CPU across the same window → escalating with that specific evidence let Infrastructure act immediately → verifying with affected employees confirmed the fix actually worked.",
      },
    },
    "outcome-resolved-unverified-infra": {
      id: "outcome-resolved-unverified-infra",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You investigated well and escalated to Infrastructure with strong evidence, but closed the ticket without confirming with affected employees that the fix actually worked.",
        escalatedTeam: "infrastructure",
        modelResolution: "The diagnosis and escalation were solid — the missing step was verifying with the people who originally reported the problem before closing.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated to a plausible team, but without the specific evidence you gathered, forcing them to re-investigate from scratch before they can even start.",
        escalatedTeam: "applications",
        modelResolution: "The evidence you gathered — deployment timing, resource usage, or slow queries — is exactly what makes an escalation actionable. Naming a likely team without citing evidence wastes the investigation you already did.",
      },
    },
  },
};
