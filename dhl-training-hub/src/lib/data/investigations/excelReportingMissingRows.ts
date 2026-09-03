import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, files, or data. See root CLAUDE.md.
export const excelReportingMissingRowsScenario: InvestigationScenario = {
  id: "excel-reporting-missing-rows",
  title: "Daily Excel Reporting Automation Keeps Missing Rows",
  description:
    "A scheduled Power Automate flow reads a growing Excel table and emails notifications for flagged rows — but some clearly-flagged rows never get an email. Practice isolating a silent, partial-data automation failure.",
  difficulty: "Intermediate",
  estimatedMinutes: 12,
  initialReport:
    "A scheduled flow reads a shipment tracking Excel table each morning and emails a notification for every row marked \"Delayed.\" A team member reports that a shipment they know was delayed for days never got an email — even though most delayed shipments do.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "One missed notification was reported, but this is a scheduled automation processing every row every day — worth checking whether this is an isolated miss or a wider, systematic gap before assuming it's a one-off.",
  relatedTopicIds: ["excel-automation-patterns", "loops-apply-to-each", "exception-handling-testing-and-monitoring", "troubleshooting-a-broken-flow"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Distinguish a logic problem (the condition is wrong) from a data-access problem (the row never reached the condition at all).",
    "Recognize a silent pagination/row-limit failure in an Excel-reading automation.",
    "Use Run History to inspect exactly what data an action actually returned, not what it was assumed to return.",
    "Choose a fix that addresses the actual cause rather than a workaround that only fixes today's missed row.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "application",
  topicsToReview: ["excel-automation-patterns", "loops-apply-to-each", "exception-handling-testing-and-monitoring"],
  modelDocumentation: {
    issueSummary: "A scheduled flow that emails notifications for \"Delayed\" rows in a growing Excel table silently skipped some flagged rows, including at least one confirmed by a team member.",
    scopeImpact: "Missed rows were concentrated near the bottom of the table (higher row numbers) — the table has grown from roughly 60 to roughly 180 rows over two months.",
    evidenceGathered: "The flow's condition logic tested correctly against a known-missed row in isolation. Run History showed the \"List rows present in a table\" action returning fewer rows than the table actually contains — capped at its default limit, with no pagination setting enabled.",
    likelyCause: "The default row-return limit on the List Rows action was silently truncating results once the table grew past that limit — rows beyond it never entered the loop at all, regardless of their Status value.",
    actionTaken: "Enabled pagination on the List Rows action so all matching rows are retrieved, and re-ran the flow manually against the current table to confirm every delayed row was now included.",
    escalation: "Not required — this was a configuration setting within the flow itself, correctable directly.",
    verification: "Re-ran the flow and confirmed the previously-missed shipment, and all other currently-delayed shipments, received a notification.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the report. A scheduled flow reads a shipment tracking Excel table every morning and emails a notification for each row marked \"Delayed.\" A team member says a shipment they know was delayed for days never triggered an email.",
      diagnosticQuestions: [
        { id: "q-always", question: "Has this always happened, or is it new?", answer: "The team member says this seemed to start a month or two ago — it used to reliably catch every delayed shipment." },
        { id: "q-others", question: "Is this the only missed row anyone has noticed?", answer: "It's the only one specifically reported so far, but nobody has systematically checked every row against every email sent." },
        { id: "q-table-size", question: "How big is the table now, roughly?", answer: "Around 180 rows currently. It was much smaller when the flow was first built." },
        { id: "q-row-position", question: "Where in the table is the missed row?", answer: "Near the bottom — one of the more recently added rows." },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Check whether other rows near the bottom of the table are also being missed",
          description: "See if this is an isolated case or a wider pattern.",
          stage: "scope",
          quality: "strong",
          feedback: "Good instinct — checking whether the miss is isolated or systematic tells you a lot about where to look next, before diving into the flow's logic.",
          nextNodeId: "scope-checked",
        },
        {
          id: "assume-logic-broken",
          label: "Assume the condition logic is wrong and start rewriting it",
          description: "Jump straight to changing the flow's condition.",
          stage: "diagnose",
          quality: "weak",
          feedback: "Rewriting logic before gathering any evidence risks fixing something that isn't actually broken — and won't explain why most rows work correctly while some don't.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-checked": {
      id: "scope-checked",
      prompt: "You check a sample of other rows near the bottom of the table against the emails that were actually sent.",
      evidence: [
        "Several other rows near the bottom of the table, also marked \"Delayed,\" never triggered a notification either.",
        "Rows near the top of the table are consistently processed correctly, every time.",
      ],
      actions: [
        {
          id: "check-run-history",
          label: "Open Run History and inspect what the flow's data-reading action actually returned",
          description: "See exactly what data the flow worked with on a recent run.",
          stage: "evidence",
          quality: "strong",
          feedback: "Exactly right — checking what was actually returned, rather than assumed, is the fastest way to find a gap between the table and what the flow sees.",
          nextNodeId: "run-history-checked",
        },
        {
          id: "check-condition-logic",
          label: "Manually test the condition logic against a known-missed row's data",
          description: "Confirm whether the condition itself would fire correctly for this row.",
          stage: "evidence",
          quality: "reasonable",
          feedback: "A reasonable check — this rules out (or confirms) a logic problem, though it doesn't yet explain why only rows near the bottom are affected.",
          nextNodeId: "condition-checked",
        },
        {
          id: "guess-file-corrupted",
          label: "Assume the Excel file itself is corrupted and ask for a new copy",
          description: "Treat this as a file-integrity problem.",
          stage: "diagnose",
          quality: "weak",
          feedback: "Nothing so far points to file corruption — rows near the top read perfectly fine from the same file. This skips checking what the flow's own actions actually returned.",
          nextNodeId: "scope-checked",
        },
      ],
    },

    "condition-checked": {
      id: "condition-checked",
      prompt: "You test the flow's condition (Status equals \"Delayed\") directly against the missed row's data.",
      evidence: [
        "The condition logic itself is correct — tested manually against the missed row's exact values, it would evaluate to true and should have triggered a notification.",
        "This suggests the row's data never actually reached the condition step at all.",
      ],
      actions: [
        {
          id: "check-run-history-2",
          label: "Now check Run History to see what the data-reading action actually returned",
          description: "Confirm whether the row was ever read from the table in the first place.",
          stage: "evidence",
          quality: "strong",
          feedback: "Good follow-through — if the condition logic is fine, the next question is whether the row ever entered the loop at all.",
          nextNodeId: "run-history-checked",
        },
      ],
    },

    "run-history-checked": {
      id: "run-history-checked",
      prompt: "You inspect the \"List rows present in a table\" action's output in Run History for a recent run.",
      evidence: [
        "The action returned exactly 100 rows, even though the table currently contains around 180.",
        "No pagination or \"threshold\" setting is configured on this action — it's using the default row-return limit.",
        "The rows that were returned are the first 100 in the table; the missed rows are all beyond that point.",
      ],
      actions: [
        {
          id: "check-list-rows-settings",
          label: "Check the List Rows action's configuration for a pagination/threshold setting",
          description: "Confirm exactly what's capping the result set.",
          stage: "evidence",
          quality: "strong",
          feedback: "This confirms the mechanism precisely — a default row-return limit, not enabled to retrieve everything, silently caps how much of the table the flow ever sees.",
          nextNodeId: "list-rows-settings-checked",
        },
        {
          id: "proceed-from-runhistory",
          label: "You have enough evidence — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "reasonable",
          feedback: "You have strong evidence already, though confirming the exact setting first would make the fix more precise.",
          nextNodeId: "hub",
        },
      ],
    },

    "list-rows-settings-checked": {
      id: "list-rows-settings-checked",
      prompt: "You confirm the exact cause.",
      evidence: [
        "The List Rows action's pagination setting is off, so it returns only its default limit of rows per run.",
        "As the table grew past that limit over the past couple of months, an increasing number of the most recently added rows have never been read by the flow at all — regardless of their Status value.",
      ],
      actions: [
        {
          id: "proceed-to-hub",
          label: "You have a clear, evidenced cause — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "strong",
          feedback: "Strong — you've isolated a specific, verifiable cause: a silent row-limit, not a logic bug and not corrupted data.",
          nextNodeId: "hub",
        },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You know the condition logic is correct, and the real cause is that the List Rows action silently stops returning rows past its default limit, which the growing table has now exceeded. Decide how to proceed.",
      actions: [
        {
          id: "fix-enable-pagination",
          label: "Enable pagination on the List Rows action so it retrieves every matching row, then re-run against the full table",
          description: "Fix the actual cause directly.",
          stage: "resolve",
          quality: "strong",
          feedback: "This is the correct fix — it addresses the root cause directly and will keep working as the table continues to grow, rather than needing another manual increase later.",
          nextNodeId: "post-resolve",
        },
        {
          id: "fix-add-filter",
          label: "Add a filter query to only retrieve rows marked \"Delayed\" in the first place, reducing how much data needs to be returned",
          description: "Reduce the row count the action needs to return, rather than raising the limit.",
          stage: "resolve",
          quality: "reasonable",
          feedback: "A reasonable alternative — filtering at the source reduces the amount of data pulled each run, which also avoids the row-limit problem, though it's worth confirming this still won't be exceeded as delayed-shipment volume grows.",
          nextNodeId: "post-resolve-alt",
        },
        {
          id: "workaround-manual-check",
          label: "Ask someone to manually check the bottom rows of the table each morning as a workaround",
          description: "Avoid touching the flow's configuration.",
          stage: "resolve",
          quality: "weak",
          feedback: "This just re-introduces the manual work the automation was meant to remove, and doesn't fix the actual limitation — it will keep getting worse as the table grows.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-configuration",
          label: "Escalate to whoever owns/maintains this flow, since you're not the original builder",
          description: "Hand off the fix rather than making the change yourself.",
          stage: "escalate",
          quality: "reasonable",
          feedback: "A reasonable choice if you aren't the flow's owner — escalating with this specific, evidenced cause (not just \"it's broken\") gives the owner exactly what they need to fix it quickly.",
          nextNodeId: "post-escalate",
        },
      ],
    },

    "post-resolve": {
      id: "post-resolve",
      prompt: "You enable pagination on the List Rows action so it retrieves every row in the table, regardless of size.",
      evidence: ["Fictional training evidence: a manual re-run of the flow against the current ~180-row table now returns all rows, including the previously-missed ones."],
      actions: [
        { id: "verify-resolve", label: "Confirm the previously-missed shipment, and other bottom-of-table rows, now trigger notifications", description: "Check the fix actually worked for the real cases.", stage: "verify", quality: "strong", feedback: "This confirms the fix works for the actual rows that were missed, not just that the setting was changed.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-resolve", label: "Close this out without re-running the flow to confirm", description: "Assume the setting change was sufficient.", stage: "verify", quality: "weak", feedback: "The fix is very likely correct, but closing without actually re-running and checking is a habit worth breaking — confirming costs little and removes any doubt.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "post-resolve-alt": {
      id: "post-resolve-alt",
      prompt: "You add a filter query to the List Rows action so it only retrieves rows marked \"Delayed,\" reducing the amount of data returned each run.",
      evidence: ["Fictional training evidence: a manual re-run confirms all currently-delayed rows, including the previously-missed one, are now returned and processed."],
      actions: [
        { id: "verify-resolve-alt", label: "Confirm the previously-missed shipment now triggers a notification, and check the filtered row count is comfortably under the limit", description: "Check the fix worked and has headroom to grow.", stage: "verify", quality: "strong", feedback: "Good — confirming both that it works now and that there's headroom as volume grows avoids just re-hitting the same limit later under a different name.", nextNodeId: "outcome-resolved-filtered-verified" },
        { id: "skip-verify-resolve-alt", label: "Assume filtering solved it without checking the new row count", description: "Skip confirming headroom against the limit.", stage: "verify", quality: "weak", feedback: "This fixes today's case, but without checking the filtered count against the limit, the same silent-truncation problem could resurface later as delayed-shipment volume grows.", nextNodeId: "outcome-resolved-filtered-unverified" },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt: "You escalate to the flow's owner with the specific evidence: the List Rows action's default limit is truncating results now that the table has grown past it.",
      evidence: ["Fictional training evidence: the flow owner enables pagination on the List Rows action based on your findings and confirms the fix with a manual run."],
      actions: [
        { id: "verify-escalate", label: "Follow up to confirm the fix was applied and the previously-missed shipment now gets notified", description: "Close the loop rather than assuming the escalation was handled.", stage: "verify", quality: "strong", feedback: "Following up after escalating — rather than assuming it was handled — is what actually closes the loop for the person who originally reported the problem.", nextNodeId: "outcome-escalated-verified" },
        { id: "skip-verify-escalate", label: "Consider it done once escalated, without following up", description: "Move on without confirming the outcome.", stage: "verify", quality: "weak", feedback: "Your diagnosis was excellent, but escalating and never confirming the outcome risks the issue quietly staying open, or resurfacing without anyone connecting it back to your findings.", nextNodeId: "outcome-escalated-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You correctly separated a logic problem from a data-access problem, found the silent row-limit in Run History, fixed it at the root cause, and verified it against the real missed rows.",
        modelResolution: "Checking scope revealed a pattern (bottom-of-table rows only) → testing the condition logic ruled out a logic bug → inspecting Run History's actual returned data revealed the row-limit truncation → enabling pagination fixed the root cause in a way that scales with future table growth → verifying against the real missed shipment confirmed it.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You correctly diagnosed and fixed the row-limit issue, but closed the investigation without re-running the flow to confirm the missed rows were actually now included.",
        modelResolution: "The diagnosis and fix were correct — the missing step was a direct re-run confirming the previously-missed shipment now triggers correctly.",
      },
    },
    "outcome-resolved-filtered-verified": {
      id: "outcome-resolved-filtered-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You fixed the issue with a filtered query rather than raising the limit, and verified both that it worked and that it has headroom for future growth.",
        modelResolution: "Filtering at the source is a legitimate alternative to raising the pagination limit — checking headroom against future volume growth is what makes this a genuinely durable fix rather than one that resurfaces later.",
      },
    },
    "outcome-resolved-filtered-unverified": {
      id: "outcome-resolved-filtered-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "Your filtering fix likely resolved the immediate case, but without checking the new row count against the limit, the same silent-truncation risk could reappear later.",
        modelResolution: "The filtering approach was reasonable; the missing step was confirming the filtered result count has real headroom under the row limit as volume grows.",
      },
    },
    "outcome-escalated-verified": {
      id: "outcome-escalated-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You correctly diagnosed the row-limit cause, escalated it to the flow's owner with specific evidence, and followed up to confirm it was actually fixed.",
        modelResolution: "Escalating with a precise, evidenced cause (not just \"it's broken\") is exactly what makes an escalation efficient — and following up afterward is what confirms the loop actually closed.",
        escalatedTeam: "applications",
      },
    },
    "outcome-escalated-unverified": {
      id: "outcome-escalated-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "Your diagnosis and escalation were strong, but without a follow-up, you can't be sure the issue was actually fixed.",
        modelResolution: "The diagnostic work here was excellent — the missing step was confirming the outcome after escalating, rather than assuming the handoff was sufficient.",
        escalatedTeam: "applications",
      },
    },
  },
};
