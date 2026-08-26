import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, roles, or data. See root CLAUDE.md.
export const authVsAuthorizationScenario: InvestigationScenario = {
  id: "auth-vs-authorization",
  title: "User Can Log In, But Can't Access a Restricted Function",
  description:
    "Separate authentication (\"who are you?\") from authorization (\"what are you allowed to do?\") on a real-feeling permissions ticket.",
  difficulty: "Foundation",
  estimatedMinutes: 10,
  initialReport:
    "An employee reports they can log into the finance application normally, but get an \"Access Denied\" message opening the invoice approval screen they say they need for their new role.",
  suggestedBusinessImpact: "One user",
  businessImpactNote:
    "This is reported by one employee, but if the cause turns out to be how a role was applied rather than something specific to their account, the true impact could be wider — worth re-checking scope once you know the cause, not just at the start.",
  relatedTopicIds: ["authentication", "directory-services", "least-privilege", "escalation"],
  likelyTeams: ["applications", "infrastructure"],
  learningObjectives: [
    "Separate authentication (proving who you are) from authorization (what you're allowed to do).",
    "Recognize that \"Access Denied\" after a successful login is almost always an authorization question, not a login problem.",
    "Apply least-privilege thinking — fix access through the proper role/approval process, not by patching around it.",
    "Tell a single-account issue apart from a systemic role/group misconfiguration.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "authorization",
  topicsToReview: ["authentication", "directory-services", "least-privilege"],
  modelDocumentation: {
    issueSummary: "Employee could log into the finance application normally but received \"Access Denied\" opening the invoice approval screen required for their new role.",
    scopeImpact: "One employee reported; checked whether other recently-promoted employees had the same issue.",
    evidenceGathered: "Login and all other screens worked normally — the error was specific to the invoice approval screen. The employee's assigned role was \"Finance - Standard\"; the role change request from their manager specified \"Finance - Approver.\" The role update made last week applied the wrong role.",
    likelyCause: "The employee's role was updated to the wrong role during a recent change, not a login/authentication problem.",
    actionTaken: "Corrected the role assignment through the proper access-request process, referencing the manager's original request.",
    escalation: "Checked whether other employees from the same batch of role changes were affected; one other employee had the same issue and was corrected at the same time.",
    verification: "Confirmed with the employee(s) that the invoice approval screen was now accessible.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. An employee logs into the finance application fine, but gets \"Access Denied\" when opening the invoice approval screen they say their new role requires.",
      diagnosticQuestions: [
        { id: "q-others", question: "Is anyone else affected?", answer: "So far just this one employee, who mentions they recently moved into a new role." },
        { id: "q-worked-before", question: "Did this work before?", answer: "No — they say they've never had access to this screen. It's a new requirement of their new role, not something that broke." },
        { id: "q-exact-error", question: "What exact error appears?", answer: "\"Access Denied,\" shown after successfully logging in and navigating to the invoice approval screen." },
        { id: "q-other-device", question: "Does this happen on another device?", answer: "They haven't tried another device, but login itself works everywhere they've tried." },
      ],
      actions: [
        {
          id: "confirm-auth-ok",
          label: "Confirm the employee can log in and use the rest of the application normally",
          description: "Check whether this is really about logging in at all.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — confirming the rest of the application works normally tells you this is specific to one screen, not a general login problem.",
          nextNodeId: "auth-confirmed",
        },
        {
          id: "reset-password",
          label: "Reset their password, assuming it's a login problem",
          description: "Treat this as an authentication issue.",
          stage: "resolve",
          quality: "weak",
          feedback: "They're already logging in successfully — a password reset addresses authentication, but the error happens after login, while trying to open a specific screen. That's an authorization symptom.",
          nextNodeId: "start",
        },
      ],
    },

    "auth-confirmed": {
      id: "auth-confirmed",
      prompt: "You confirm the scope of the problem.",
      evidence: [
        "The employee logs in successfully and uses every other screen in the application without issue.",
        "The error appears only when opening the invoice approval screen specifically.",
      ],
      actions: [
        {
          id: "check-role",
          label: "Check what role/permission group the employee is currently assigned",
          description: "Look at what they're actually authorized for.",
          stage: "evidence",
          quality: "strong",
          feedback: "Exactly right — a screen-specific \"Access Denied\" after a successful login is almost always about the assigned role, not the login itself.",
          nextNodeId: "role-checked",
        },
        {
          id: "check-recent-change",
          label: "Check whether their role assignment changed recently",
          description: "Look for a change that could explain this.",
          stage: "evidence",
          quality: "strong",
          feedback: "Also a strong move — checking recent changes often explains exactly why access looks wrong today.",
          nextNodeId: "recent-change-checked",
        },
        {
          id: "grant-directly",
          label: "Grant them access to the screen directly, without checking their role",
          description: "Bypass the role system to make the error go away.",
          stage: "resolve",
          quality: "weak",
          feedback: "Patching one screen's access directly works around the role/permission system — it makes it hard to track who has access to what and why, which is exactly what least-privilege practices try to avoid.",
          nextNodeId: "auth-confirmed",
        },
      ],
    },

    "role-checked": {
      id: "role-checked",
      prompt: "You check the employee's assigned role.",
      evidence: [
        "The employee is assigned the \"Finance - Standard\" role, which does not include invoice approval.",
        "Invoice approval requires the \"Finance - Approver\" role. Their manager's change request said they should have been moved to that role.",
      ],
      actions: [
        { id: "check-recent-change-2", label: "Also check when and how the role was last changed", description: "See what happened during the update.", stage: "evidence", quality: "strong", feedback: "Good — confirming the change history explains why the wrong role ended up assigned.", nextNodeId: "recent-change-checked" },
        { id: "proceed-from-role", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — you know exactly which role is missing and what it should be.", nextNodeId: "hub" },
      ],
    },

    "recent-change-checked": {
      id: "recent-change-checked",
      prompt: "You check the change history for the employee's role.",
      evidence: [
        "Their role was updated last week, but the update applied \"Finance - Standard\" rather than \"Finance - Approver\" — it looks like the wrong role was selected during the change.",
      ],
      actions: [
        { id: "check-role-2", label: "Also confirm what role is currently assigned and what it grants", description: "Double-check the current state.", stage: "evidence", quality: "strong", feedback: "Good — confirming the current assignment directly makes your case solid.", nextNodeId: "role-checked" },
        { id: "proceed-from-change", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a documented request for one role, with the wrong role actually applied, is clear evidence.", nextNodeId: "hub" },
        { id: "assume-directory-outage", label: "Assume the directory/identity system itself is malfunctioning", description: "Treat this as a system-wide problem.", stage: "diagnose", quality: "weak", feedback: "Nothing here suggests a system-wide outage — this looks like one role assignment was set incorrectly during a routine change, not a directory system failure.", nextNodeId: "recent-change-checked" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You know the employee authenticates fine, and their assigned role simply isn't the one their new responsibilities require. Decide how to proceed.",
      actions: [
        {
          id: "resolve-with-approval",
          label: "Correct the role assignment through the proper access-request process, referencing the manager's request",
          description: "Fix it the right way, with a record of why.",
          stage: "resolve",
          quality: "strong",
          feedback: "This is the correct fix — it grants exactly the access that was actually approved, through the process that keeps a record of who authorized it.",
          nextNodeId: "post-resolve",
        },
        {
          id: "resolve-without-approval",
          label: "Change their role yourself immediately, without going through any approval step",
          description: "Skip the process since the right answer seems obvious.",
          stage: "resolve",
          quality: "weak",
          feedback: "Even when the fix seems obvious, granting elevated access without the approval step undermines least-privilege controls and leaves no record of why the change was made.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-systemic",
          label: "Escalate to check whether other recently-promoted employees have the same misassigned role",
          description: "Look for a batch problem, not just this one account.",
          stage: "escalate",
          quality: "reasonable",
          feedback: "A reasonable, thorough move — if one role change was applied wrong, others from the same batch might be too. This adds a step but can prevent repeat tickets.",
          nextNodeId: "post-escalate-systemic",
        },
        {
          id: "redirect-to-manager",
          label: "Tell the employee to ask their manager to grant access directly",
          description: "Send the request back to the manager.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "The manager already made the correct request through the proper process — the request wasn't wrong, the role assignment was applied incorrectly. Sending them back to redo something they already did correctly doesn't help.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-resolve": {
      id: "post-resolve",
      prompt: "You correctly assign the \"Finance - Approver\" role through the proper access-request process, referencing the manager's original approval.",
      evidence: ["Fictional training evidence: the role assignment has been corrected and logged against the manager's original request."],
      actions: [
        { id: "verify-resolve", label: "Confirm with the employee that they can now open the invoice approval screen", description: "Check the fix actually worked.", stage: "verify", quality: "strong", feedback: "This confirms the access change actually resolved what the employee reported, not just that a role field changed.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-resolve", label: "Close the ticket without checking back", description: "Assume the role change was sufficient.", stage: "verify", quality: "weak", feedback: "The fix was correct here, but closing without confirming with the employee is a habit worth breaking — role changes don't always take effect immediately in every system.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "post-escalate-systemic": {
      id: "post-escalate-systemic",
      prompt:
        "You escalate to check for a batch problem while also correcting this employee's role through the proper process. The check finds one other employee from the same batch of changes with the same mismatched role; both are corrected.",
      evidence: ["Fictional training evidence: one additional employee from the same change batch had the same mismatched role and has now been corrected."],
      actions: [
        { id: "verify-systemic", label: "Confirm access now works correctly for both affected employees", description: "Verify the broader fix worked.", stage: "verify", quality: "strong", feedback: "This confirms the fix worked for everyone affected by the batch issue, not just the original reporter.", nextNodeId: "outcome-resolved-systemic" },
        { id: "skip-verify-systemic", label: "Assume it's fixed since both roles were updated", description: "Skip confirming with either employee.", stage: "verify", quality: "weak", feedback: "Catching the second affected employee was excellent work — skipping the final check means you're assuming, not confirming, that both are actually unblocked.", nextNodeId: "outcome-resolved-systemic-weak" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You correctly separated authentication from authorization, identified the exact role mismatch, fixed it through the proper approval process, and verified it worked.",
        modelResolution: "Confirming login worked ruled out authentication → checking the assigned role against the manager's request isolated an authorization problem → fixing it through the proper process kept a clear record → verifying with the employee confirmed it actually worked.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You correctly diagnosed and fixed the role mismatch through the proper process, but closed the ticket without confirming with the employee that access actually worked.",
        modelResolution: "The diagnosis and fix were correct — the missing step was verifying with the employee before closing, since role changes don't always take effect immediately everywhere.",
      },
    },
    "outcome-resolved-systemic": {
      id: "outcome-resolved-systemic",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You diagnosed the authorization issue, fixed it properly, checked for a batch problem, found and fixed a second affected employee, and verified both were working.",
        modelResolution: "This is the most thorough version of the investigation — separating authentication from authorization, fixing the root role assignment through the proper process, checking for a wider pattern, and verifying the outcome for everyone affected.",
      },
    },
    "outcome-resolved-systemic-weak": {
      id: "outcome-resolved-systemic-weak",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You caught and fixed a batch role-assignment issue affecting two employees, but didn't confirm with either of them that access actually worked afterward.",
        modelResolution: "Catching the second affected employee was strong investigative work — the remaining step is verifying with both employees directly rather than assuming the role change was sufficient.",
      },
    },
  },
};
