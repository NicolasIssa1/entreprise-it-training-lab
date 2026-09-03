import { LearningTopic } from "@/lib/types";

// BPO & Process Automation (post-Phase-10 learning expansion) — how to understand a
// business process before automating it, and the Microsoft Power Automate concepts
// needed to actually build/troubleshoot a flow. Added because a BPO (Business Process
// Optimization — NOT Business Process Outsourcing, see the first topic below)
// colleague asked Nicolas to learn Power Automate for a real automation project. All
// content is generic BPO methodology and generic Power Automate concepts — never a
// confirmed description of any specific company's process, systems, or automations.
// See root CLAUDE.md's confidentiality rules and docs/BPO-LEARNING.md.
export const bpoAutomationTopics: LearningTopic[] = [
  // ---------------------------------------------------------------------
  // BPO Foundations
  // ---------------------------------------------------------------------
  {
    id: "bpo-process-optimization",
    title: "Business Process Optimization (BPO)",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Systematically understanding and improving how a business process actually works — the foundation this whole learning path is named after.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Explain what Business Process Optimization means in this curriculum, and why that's different from Business Process Outsourcing",
      "Describe the general goal of BPO: understand a process before changing or automating it",
      "Recognize BPO as the discipline that comes before automation, not a synonym for it",
    ],
    simpleExplanation:
      "Business Process Optimization (BPO) means looking closely at how a business task actually gets done today, finding what's slow or error-prone about it, and improving it — sometimes by automating part of it, sometimes just by simplifying the steps. Important: \"BPO\" is also a common industry abbreviation for Business Process Outsourcing (paying another company to run a process for you) — a completely different concept. Every use of \"BPO\" in this learning path means Business Process Optimization.",
    eli10:
      "Imagine your morning routine takes 40 minutes and makes you late sometimes. BPO is stepping back, watching yourself do it for a few days, noticing you always hunt for your keys, and fixing that one step — rather than just rushing faster through the same broken routine.",
    technicalExplanation:
      "Business Process Optimization is the practice of analyzing an existing (\"As-Is\") business process, identifying inefficiencies, delays, errors, or unnecessary steps, and redesigning it into an improved (\"To-Be\") process — which may or may not involve automation. It sits upstream of any automation project: automation applied to a process nobody has actually analyzed usually just makes the existing problems happen faster. BPO borrows lightweight ideas from process improvement traditions (Lean's focus on removing non-value-adding work, general root-cause thinking) without requiring formal certification in any one methodology.",
    businessPurpose:
      "Large organizations run on hundreds of recurring processes. Small inefficiencies in a process that runs thousands of times a year compound into significant cost, delay, and error. BPO gives a structured way to find and fix those inefficiencies deliberately, rather than living with \"this is just how it's always been done.\"",
    commonProblems: [
      "Someone is asked to \"automate a process\" and jumps straight to building, without ever mapping out what the current process actually is.",
      "\"BPO\" is used ambiguously in a conversation — outsourcing and optimization get confused because the same three letters are used for both.",
      "Process improvement is treated as a one-time project rather than something revisited as the business changes.",
    ],
    troubleshootingSteps: [
      "Before touching a process, confirm which \"BPO\" is meant — outsourcing it, or optimizing it — if the term comes up ambiguously.",
      "Ask what the current, actual process is (As-Is) before proposing any change.",
      "Separate \"this step is slow\" from \"this step shouldn't exist at all\" — optimization sometimes means removing a step, not speeding it up.",
      "Treat any proposed improvement as a hypothesis to validate with the people who actually do the work, not a decision made from the outside.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Requirements analysis and process modeling are the same discipline BPO applies to business operations rather than software features." },
    ],
    practiceScenario: {
      scenario: "A colleague says, \"we're looking at BPO for our reporting process.\" Before responding, you realize you're not sure which meaning they mean.",
      question: "What should you clarify first?",
      guidance: "Whether they mean sending the reporting process to an external provider (outsourcing) or redesigning/automating it internally (optimization) — the two lead to completely different next steps, and assuming the wrong one wastes everyone's time.",
    },
    questionToAskAtWork: "When someone mentions \"BPO\" or \"automating a process,\" has the current process actually been mapped out yet, or are we starting from a blank page?",
    relatedTopicIds: ["business-process", "digital-transformation", "business-automation", "bpo-method-lifecycle"],
    keywords: ["bpo", "business process optimization", "business process outsourcing", "process improvement"],
  },
  {
    id: "process-workflow-procedure",
    title: "Process vs. Workflow vs. Procedure",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Three related but distinct terms BPO work depends on getting straight: the overall process, its daily execution, and the exact steps of one task.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Distinguish a business process, an operational workflow, and a written procedure",
      "Pick the correct term when describing a piece of work in a BPO conversation",
      "Recognize that a single process can contain many procedures, executed as a repeating workflow",
    ],
    simpleExplanation:
      "A process is the big picture (\"how we handle a customer request\"). A workflow is that process happening again and again, day after day. A procedure is the exact, step-by-step instructions for one specific task inside it. They describe the same reality at three different zoom levels.",
    eli10:
      "Process is \"how we make pizza here.\" Workflow is the kitchen actually making pizza after pizza all night. Procedure is the exact numbered steps taped to the wall for how to stretch the dough.",
    technicalExplanation:
      "A business process describes an end-to-end sequence of activities producing a defined outcome, usually at a conceptual/design level. An operational workflow is that same process as it actually executes repeatedly in day-to-day operations, often with system dependencies and timing constraints. A procedure is a granular, prescriptive set of instructions for completing one specific task correctly and consistently — the most detailed of the three. In BPO work, mapping usually starts at the process level, then drills into workflow behavior, then documents individual procedures only where consistency actually matters.",
    businessPurpose:
      "Using these terms precisely avoids miscommunication in requirements conversations — \"automate the process\" and \"automate this one procedure\" are very different-sized requests, and confusing them leads to scope mistakes.",
    commonProblems: [
      "A stakeholder asks to \"fix the process\" when they actually mean one specific procedure buried inside it.",
      "Documentation exists at only one zoom level (e.g. only a high-level process diagram), so nobody actually knows the exact steps a person follows.",
      "Two people use \"process\" and \"procedure\" interchangeably in the same meeting, causing confusion about scope.",
    ],
    troubleshootingSteps: [
      "When someone describes a problem, ask which zoom level they mean: the whole process, the daily workflow, or one procedure.",
      "If documentation is missing at the procedure level, that's often exactly where automation requirements go wrong later.",
      "Confirm scope explicitly in writing: \"are we optimizing the whole request-to-fulfillment process, or just the intake step?\"",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors decomposing a system into subsystems, components, and functions — different levels of the same design." },
    ],
    practiceScenario: {
      scenario: "A manager says \"the onboarding process is broken.\" Investigation shows the overall flow is fine, but one specific procedure — manually re-typing data into a second system — is the actual problem.",
      question: "How should this be reframed?",
      guidance: "The process itself doesn't need redesigning; one procedure inside its workflow does. Scoping the fix correctly (one procedure, likely a good automation candidate) avoids an unnecessarily large project.",
    },
    questionToAskAtWork: "When we talk about improving something, are we talking about the whole process, its daily workflow, or one specific procedure?",
    relatedTopicIds: ["bpo-process-optimization", "business-process", "operational-workflow"],
    prerequisiteTopicIds: ["bpo-process-optimization"],
    keywords: ["process", "workflow", "procedure", "terminology"],
  },
  {
    id: "process-owner-stakeholders",
    title: "Process Owner & Stakeholders",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Every process has people accountable for it, executing it, and affected by it — identifying them correctly is step one of any BPO project.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain the difference between a process owner, an executor, and an affected stakeholder",
      "Identify why skipping stakeholder identification derails process-improvement projects",
      "List the stakeholder questions to ask before proposing any change",
    ],
    simpleExplanation:
      "A process owner is accountable for how a process works and whether it's working well. Executors are the people who actually do the steps day to day. Stakeholders are everyone with a real interest in the outcome — including people downstream who never touch the process directly but depend on its output.",
    eli10:
      "If the process is a school bus route, the owner decides the route, the driver executes it every day, and the stakeholders are every kid, parent, and teacher who depends on the bus showing up on time.",
    technicalExplanation:
      "The process owner is typically accountable for defining, maintaining, and approving changes to a process — not necessarily the person performing it. Executors are the day-to-day operators, whose tacit knowledge of exceptions and workarounds is often the richest source of As-Is information. Stakeholders extend further: anyone whose work, data, or experience depends on the process's output, including other teams and, ultimately, customers. A BPO or automation project that only talks to the process owner and skips executors typically misses real-world exceptions the documented process never mentions.",
    businessPurpose:
      "Improving or automating a process without input from the people who actually run it produces designs that look correct on paper but break on real exceptions — a very common, very avoidable cause of failed automation projects.",
    commonProblems: [
      "A process is redesigned based only on a manager's mental model, without ever observing or interviewing the people executing it.",
      "A change is approved by someone who isn't actually the process owner, so it gets reversed or ignored later.",
      "A downstream stakeholder is never consulted, and the \"improved\" process breaks something they depended on.",
    ],
    troubleshootingSteps: [
      "Before proposing any change, list who owns the process, who executes it, and who consumes its output.",
      "Interview at least one executor directly — not just their manager — to surface undocumented steps and workarounds.",
      "Confirm who actually has authority to approve a process change before investing time designing one.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Stakeholder analysis is a standard early step in requirements engineering, for exactly the same reason." },
    ],
    practiceScenario: {
      scenario: "A process redesign is approved by a department manager, built, and deployed — then the team that actually runs the process daily says it doesn't match how they really work.",
      question: "What step was skipped?",
      guidance: "The executors were never consulted — only the process owner's mental model was used. Real As-Is behavior, including undocumented exceptions, usually only surfaces by talking to the people doing the work.",
    },
    questionToAskAtWork: "Who actually owns this process, and have the people who execute it day to day been part of this conversation?",
    relatedTopicIds: ["as-is-process", "requirements-gathering", "bpo-process-optimization"],
    keywords: ["process owner", "stakeholders", "executor", "accountability"],
  },
  {
    id: "as-is-process",
    title: "As-Is Process",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Documenting exactly how a process actually works today — including the messy, undocumented parts — before proposing any change.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what an As-Is process map represents and why accuracy matters more than tidiness",
      "Recognize the common failure of documenting the intended process instead of the real one",
      "Describe practical ways to capture As-Is behavior (observation, interviews, system data)",
    ],
    simpleExplanation:
      "The As-Is process is how something actually happens right now — every step, including the annoying manual ones, the workarounds, and the exceptions — not how it's supposed to happen according to an old policy document.",
    eli10:
      "It's like filming exactly how you make your bed each morning, wrinkles and all, instead of writing down the \"correct\" way from a manual nobody follows.",
    technicalExplanation:
      "As-Is process documentation captures the current state of a process with fidelity: every step, decision point, handoff, system touched, and exception path, as it genuinely occurs — not the idealized or originally-designed version. It's typically built from a mix of stakeholder interviews, direct observation, and system/data evidence (e.g. audit logs, timestamps), because self-reported process descriptions reliably omit undocumented workarounds people don't think to mention. As-Is is the mandatory input to identifying pain points and designing a To-Be process — skipping or rushing it is one of the most common causes of automation projects that don't match reality.",
    businessPurpose:
      "You cannot reliably improve or automate something you haven't accurately described. An inaccurate As-Is leads directly to a To-Be design, and eventually an automation, that fails on cases the documentation never captured.",
    commonProblems: [
      "The As-Is map matches an old policy document rather than what people actually do.",
      "Manual workarounds (someone re-keying data, a personal spreadsheet nobody official knows about) are never surfaced because nobody thought to mention them.",
      "As-Is mapping is rushed to get to the \"real work\" of building the automation faster.",
    ],
    troubleshootingSteps: [
      "Interview the people who actually execute each step, not just their manager.",
      "Ask explicitly: \"is there anything you do that isn't in the official documentation?\"",
      "Where possible, observe the process being performed, or review system data/timestamps to confirm the interview matches reality.",
      "Document exceptions and edge cases, not just the common-case happy path.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This is the same discipline as eliciting requirements from actual users rather than from a stale spec document." },
    ],
    practiceScenario: {
      scenario: "An As-Is interview says a report is \"generated automatically every morning.\" Later, you discover someone manually fixes formatting errors in it before anyone sees it.",
      question: "Why does this matter for automation planning?",
      guidance: "The real As-Is process includes a manual data-quality step that was never mentioned. Automating around it without addressing the underlying formatting problem would likely produce a flow that fails or produces bad output — the manual step exists for a reason that needs investigating.",
    },
    questionToAskAtWork: "Is there any manual step in this process that isn't written down anywhere, that I should know about before we automate around it?",
    relatedTopicIds: ["process-owner-stakeholders", "pain-points-bottlenecks", "process-mapping-and-swimlanes", "to-be-process"],
    prerequisiteTopicIds: ["process-workflow-procedure"],
    keywords: ["as-is", "current state", "process documentation", "discovery"],
  },
  {
    id: "to-be-process",
    title: "To-Be Process",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The redesigned target process — built from a validated As-Is and its known pain points, not designed from scratch in isolation.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what a To-Be process represents and how it should be derived",
      "Recognize the risk of designing a To-Be process without a validated As-Is",
      "Identify what changes between As-Is and To-Be in a typical automation project",
    ],
    simpleExplanation:
      "The To-Be process is the improved version of the process you're aiming for — after removing the pain points found in the As-Is process. It's a target design, not something built blind.",
    eli10:
      "If As-Is is filming your messy morning routine, To-Be is redesigning it once you notice you always lose your keys — maybe adding a hook by the door. It's an improvement built from what you actually observed, not a random new routine.",
    technicalExplanation:
      "A To-Be process is a redesigned version of a business process, built specifically to address the pain points and root causes identified during As-Is analysis. It should explicitly state what changed and why — which steps were removed, reordered, standardized, or automated — traceable back to a specific observed problem. To-Be design decides not just what should be automated, but also what should simply be simplified, standardized, or removed without any automation at all; automation is one possible improvement, not the only one.",
    businessPurpose:
      "A To-Be process gives everyone — stakeholders, developers, testers — a shared target to build and validate against, and a way to measure whether the change actually solved the problem it was meant to solve.",
    commonProblems: [
      "A To-Be process is designed without ever completing As-Is analysis, so it \"improves\" things that weren't actually broken and misses things that were.",
      "To-Be design automates a bad step exactly as-is, instead of asking whether the step should exist at all.",
      "Nobody validates the To-Be design with executors before building it, so it repeats the same mistake As-Is skipping does.",
    ],
    troubleshootingSteps: [
      "Confirm every element of the To-Be design traces back to a specific As-Is pain point or root cause.",
      "Ask whether each step should be automated, simplified, or removed — automation isn't the only valid answer.",
      "Validate the proposed To-Be process with the same stakeholders interviewed during As-Is, before building anything.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors moving from requirements analysis to system design — the design should be traceable back to the requirements it satisfies." },
    ],
    practiceScenario: {
      scenario: "As-Is analysis finds that a report is delayed because a source file is only generated after a separate, unrelated manual approval finishes.",
      question: "What should the To-Be process actually target?",
      guidance: "Not just \"automate report generation\" — that would still be blocked by the same upstream delay. The To-Be design needs to address the sequencing/dependency problem itself, which might mean re-ordering steps, not just automating the existing broken order faster.",
    },
    questionToAskAtWork: "For this proposed improvement, which specific As-Is pain point is it actually meant to fix?",
    relatedTopicIds: ["as-is-process", "pain-points-bottlenecks", "automation-opportunity-assessment", "bpo-method-lifecycle"],
    prerequisiteTopicIds: ["as-is-process"],
    keywords: ["to-be", "target process", "redesign", "future state"],
  },
  {
    id: "process-mapping-and-swimlanes",
    title: "Process Mapping & Swimlane Diagrams",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 8,
    shortDescription: "Visualizing a process as a flowchart, and — when multiple people, teams, or systems are involved — as a swimlane diagram showing who does what.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Read and draw a basic flowchart using start/end, task, decision, and sequence elements",
      "Explain what a swimlane diagram adds over a basic flowchart",
      "Choose which handoffs in a process are worth mapping across lanes",
    ],
    simpleExplanation:
      "A basic process map is a flowchart: a start point, a sequence of steps, decision points where the path branches, and an end point. A swimlane diagram is the same idea, but organized into horizontal or vertical \"lanes\" — one per person, team, or system — so you can see exactly who does each step and where work hands off between lanes.",
    eli10:
      "A regular flowchart is a recipe's steps in order. A swimlane diagram is that same recipe, but drawn on a table with one row per cook, so you can see who chops, who stirs, and exactly when the dish moves from one cook's hands to another's.",
    technicalExplanation:
      "Basic flowchart notation uses a small, standard vocabulary: start/end (terminator), a process/task step, a decision (branching based on a condition), and directional flow arrows showing sequence, plus inputs/outputs at each step. A swimlane (cross-functional) diagram adds parallel lanes — one per actor (a person, team, or system) — and places each step in the lane of whoever performs it, making handoffs between lanes visually obvious. Handoffs are exactly where delays, miscommunication, and errors tend to concentrate in real processes, which is why swimlanes are especially useful for BPO work even though they take more effort to build than a plain flowchart. Neither format requires specialized diagramming software — a table, text outline, or simple drawing tool is enough for training and early analysis purposes.",
    businessPurpose:
      "A shared visual makes a process's structure discussable — stakeholders can point at a specific box or a specific handoff and say \"that's where it breaks,\" which is much harder to do over a purely written description.",
    commonProblems: [
      "A process map is drawn from the process owner's assumptions rather than validated As-Is behavior.",
      "A swimlane diagram is skipped even though the real pain point is a handoff between two teams — exactly what swimlanes are best at revealing.",
      "Diagrams get too detailed too early, mapping every possible exception before the main flow is even agreed on.",
    ],
    troubleshootingSteps: [
      "Start with the main happy-path flow before adding every exception branch.",
      "If more than one person, team, or system is involved, redraw the map as a swimlane diagram to expose handoffs.",
      "Walk the diagram past the people who actually execute the process and ask them to correct it.",
      "Mark every handoff explicitly — a well-drawn handoff arrow is often more informative than the steps on either side of it.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Flowcharts and swimlane diagrams are close relatives of activity diagrams and sequence diagrams used to model software behavior across components." },
    ],
    practiceScenario: {
      scenario: "A basic flowchart of an approval process shows five steps in a straight line. Once redrawn as a swimlane diagram with Employee, Manager, and System lanes, it becomes clear the process crosses back and forth between the Employee and Manager lanes three separate times.",
      question: "Why does this matter?",
      guidance: "Each crossing between lanes is a handoff — and handoffs are common sources of delay (waiting for a person to notice/respond) and error (information lost in the handoff). The swimlane view reveals a likely pain point the flat flowchart hid.",
    },
    questionToAskAtWork: "Would drawing this as a swimlane diagram reveal a handoff we haven't actually looked closely at?",
    relatedTopicIds: ["as-is-process", "pain-points-bottlenecks", "process-owner-stakeholders"],
    keywords: ["process map", "flowchart", "swimlane diagram", "cross-functional diagram", "handoff"],
  },
  {
    id: "pain-points-bottlenecks",
    title: "Pain Points & Bottlenecks",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Finding exactly where a process is slow, error-prone, or frustrating — the specific evidence a To-Be redesign should target.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Distinguish a bottleneck (a capacity constraint slowing the whole process) from a general pain point (any source of friction)",
      "Identify common categories of process pain points",
      "Explain why a pain point needs evidence, not just a complaint, before it drives a redesign",
    ],
    simpleExplanation:
      "A pain point is anywhere in a process that's slow, error-prone, or annoying. A bottleneck is a specific kind of pain point: one step that's so slow or capacity-limited that it holds up everything after it, no matter how fast the other steps are.",
    eli10:
      "If a car wash has five stations but only one dryer, cars pile up waiting for the dryer no matter how fast they get washed. The dryer is the bottleneck — fixing the wash stations wouldn't speed anything up.",
    technicalExplanation:
      "Pain points are specific, evidenced friction sources within an As-Is process — delays, error rates, rework, manual data re-entry, unclear ownership, waiting time. A bottleneck specifically refers to a constraint step whose limited throughput or availability caps the throughput of the entire process, regardless of how efficient other steps are — a classic constraint-theory idea. Distinguishing the two matters for prioritization: improving a non-bottleneck step, even significantly, produces little overall improvement, while improving the bottleneck (even slightly) improves the whole process's throughput.",
    businessPurpose:
      "Time and budget for process improvement are limited. Correctly identifying pain points — and especially the true bottleneck — focuses effort where it will actually move the needle, instead of polishing a step that was never the real constraint.",
    commonProblems: [
      "A pain point is fixed because it's the most visible or most complained-about, even though it isn't the actual bottleneck.",
      "\"It feels slow\" is treated as sufficient evidence, without measuring where time is actually spent.",
      "A single bottleneck is fixed, and the \"improvement\" barely changes overall speed because a different, unaddressed step is now the real constraint.",
    ],
    troubleshootingSteps: [
      "Measure, don't guess: gather timestamps or counts for each step where possible, to see where time and errors actually accumulate.",
      "Ask executors directly where they experience friction, waiting, or rework.",
      "Distinguish a step that's annoying but fast from a step that's genuinely capping the process's overall throughput.",
      "After fixing a bottleneck, re-check whether a different step has become the new constraint.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Identifying a bottleneck is conceptually similar to finding the critical path or the slowest stage in a pipeline — the overall throughput is bounded by the slowest component." },
    ],
    practiceScenario: {
      scenario: "A five-step approval process has steps taking 2, 3, 40, 4, and 2 minutes respectively. Leadership proposes speeding up step 1.",
      question: "Is that a good use of effort?",
      guidance: "No — step 3 (40 minutes) is the bottleneck by a wide margin. Speeding up step 1 from 2 to 1 minute barely changes overall time; the effort should go into understanding why step 3 takes so long.",
    },
    questionToAskAtWork: "Do we actually have evidence for where this process is slowest, or are we assuming based on which step gets complained about most?",
    relatedTopicIds: ["as-is-process", "five-whys-root-cause", "to-be-process", "automation-opportunity-assessment"],
    prerequisiteTopicIds: ["as-is-process"],
    keywords: ["pain point", "bottleneck", "throughput", "constraint", "delay"],
  },
  {
    id: "five-whys-root-cause",
    title: "Root Cause Analysis for BPO: The 5 Whys",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Applying the general root-cause-analysis mindset with a specific, lightweight technique — asking \"why\" repeatedly — to get past a symptom to its actual cause.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Apply the 5 Whys technique to move from a reported symptom to a likely root cause",
      "Distinguish a symptom from a root cause in a process context",
      "Explain why root cause analysis should be based on evidence, not the first plausible guess",
    ],
    simpleExplanation:
      "The 5 Whys is a simple technique: state the problem, ask \"why does that happen?\", take that answer and ask \"why?\" again, and keep going — usually about five times — until you reach something that's actually the root cause, not just another symptom of it.",
    eli10:
      "\"The car won't start.\" Why? \"The battery is dead.\" Why? \"The alternator isn't charging it.\" Why? \"The alternator belt is broken.\" Why? \"It was never replaced on schedule.\" Now you've found the real fix — a maintenance schedule — not just \"buy a new battery,\" which would fail again.",
    technicalExplanation:
      "The 5 Whys is a lightweight, non-statistical root-cause technique: starting from an observed symptom, repeatedly ask why it occurs, using each answer as the input to the next question, until further \"why\" questions stop revealing new causal information — typically around five iterations, though the number is a guideline, not a rule. This builds on the general root-cause-analysis mindset of separating symptoms from causes, but gives a concrete, repeatable method rather than relying purely on intuition. Each answer should be grounded in evidence gathered from the process (interviews, logs, timestamps) rather than assumption, and the chain should stop at a cause that's genuinely actionable — not at \"human error,\" which is rarely a true root cause and usually hides a process or system gap underneath it.",
    businessPurpose:
      "Fixing a symptom without finding its root cause means the same problem resurfaces later, often in a different form — wasting the effort spent \"fixing\" it the first time. A quick, structured technique like the 5 Whys keeps root-cause thinking practical rather than theoretical.",
    commonProblems: [
      "The chain stops too early, at the first plausible-sounding answer, rather than continuing to ask why.",
      "The chain stops at \"someone made a mistake,\" without asking why the process allowed that mistake to happen or go unnoticed.",
      "Each \"why\" answer is guessed rather than checked against actual evidence.",
    ],
    troubleshootingSteps: [
      "State the observed symptom precisely, with evidence (e.g. \"emails are sent an average of 3 hours late,\" not \"emails are slow\").",
      "Ask \"why does that happen?\" and answer using evidence, not assumption, where possible.",
      "Repeat, using each new answer as the next question's subject, until you reach a cause that's specific and actionable.",
      "Stop and reconsider if you land on \"human error\" — ask what about the process let that error happen or go unnoticed.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "The 5 Whys is essentially manually tracing a causal chain backward — the same instinct as tracing a bug back through a call stack to its origin, rather than patching the first symptom you see." },
    ],
    practiceScenario: {
      scenario: "Symptom: \"Emails are being sent late.\" Why? \"The report they're based on is generated late.\" Why? \"The report needs data from a source file.\" Why? \"The source file is only produced after a separate manual approval step finishes.\" Why? \"That approval step has no deadline or reminder attached to it.\"",
      question: "What's the actual root cause here, and what does it suggest about automating \"send the email faster\"?",
      guidance: "The root cause is the unmanaged, undeadlined manual approval step upstream — not the email step itself. Automating email-sending alone wouldn't fix the real delay; the process needs a deadline/reminder on the approval step, or automation targeted there instead.",
    },
    questionToAskAtWork: "If we automate this step exactly as it works today, are we fixing the real root cause, or just making a symptom happen faster?",
    relatedTopicIds: ["root-cause-analysis", "pain-points-bottlenecks", "to-be-process"],
    prerequisiteTopicIds: ["pain-points-bottlenecks"],
    dontConfuseWith: [
      { topicId: "root-cause-analysis", note: "Root Cause Analysis is the general troubleshooting concept (used across IT incidents); the 5 Whys here is one concrete technique for applying that same mindset to a business process." },
    ],
    keywords: ["5 whys", "root cause", "symptom vs cause", "why-why analysis"],
  },
  {
    id: "standardization-and-value-adding-work",
    title: "Standardization & Value-Adding vs. Non-Value-Adding Work",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Two improvement levers that don't require any automation at all: making a process consistent, and cutting the steps that add no real value.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain why standardizing a process is often a prerequisite for automating it",
      "Classify a process step as value-adding or non-value-adding from the customer/business outcome's perspective",
      "Recognize that removing a step is sometimes a bigger improvement than automating it",
    ],
    simpleExplanation:
      "Standardization means everyone does a task the same, agreed way instead of their own personal variation. Value-adding work is a step that genuinely contributes to the outcome the business or customer cares about; non-value-adding work is a step that exists but doesn't — like re-entering the same data twice, or waiting for no real reason.",
    eli10:
      "If three people each fill out the same form differently, that's inconsistent — standardizing means agreeing on one way. And if part of filling out the form is copying an answer from a different sheet into the same form again, that copying step doesn't add anything — it's just extra work.",
    technicalExplanation:
      "Standardization reduces variation in how a process is executed, which matters enormously for automation: an automated flow generally requires predictable, structured input and consistent step ordering, so a highly variable manual process usually needs to be standardized before it can be reliably automated at all. Value-adding vs. non-value-adding classification, borrowed loosely from Lean thinking, evaluates each step by asking whether it directly contributes to the outcome the process exists to produce. Common non-value-adding categories include: waiting/idle time, unnecessary movement or handoffs, duplicate data entry, rework caused by earlier errors, and approvals that exist out of habit rather than genuine need. The improvement priority order is typically: eliminate non-value-adding steps first, standardize what remains, and only then consider automating — automating a non-value-adding step just makes waste happen faster.",
    businessPurpose:
      "Not every improvement needs a Power Automate flow. Removing an unnecessary step or standardizing a variable one can be cheaper, faster, and lower-risk than building automation — and doing so first also makes any later automation project simpler and more reliable.",
    commonProblems: [
      "A wasteful step (e.g. duplicate data entry) gets automated instead of eliminated, preserving the waste in a faster form.",
      "Three teams do the \"same\" process three different ways, and automation is attempted before agreeing on one standard version to automate.",
      "An approval step is kept purely out of habit, with nobody able to explain what it actually checks for.",
    ],
    troubleshootingSteps: [
      "For each step, ask: does removing this step change the outcome the customer/business actually receives? If not, it's a candidate for elimination.",
      "Check whether the process is executed consistently across people/teams before assuming it's ready to automate.",
      "Where variation exists, work with stakeholders to agree on one standard version before building anything.",
      "Prefer eliminating a wasteful step over speeding it up with automation.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors removing dead code or redundant logic before optimizing performance — fix the design first, then make the good design faster." },
    ],
    practiceScenario: {
      scenario: "A process includes: receive request → check a spreadsheet → re-type the same data into a second system → approve → notify. The re-typing step exists only because two systems don't talk to each other.",
      question: "Should this step be automated as-is, or handled differently?",
      guidance: "Re-typing between two systems is a strong non-value-adding candidate for elimination via a connector/integration rather than automated re-typing — automating the retype (e.g. an RPA-style copy-paste bot) would preserve an unnecessary step rather than removing the actual waste.",
    },
    questionToAskAtWork: "Before we automate this step, is it actually adding value — or is it work that exists only because of a gap between two systems?",
    relatedTopicIds: ["to-be-process", "automation-opportunity-assessment", "business-automation"],
    keywords: ["standardization", "value-adding", "non-value-adding", "lean", "waste"],
  },
  {
    id: "automation-opportunity-assessment",
    title: "Automation Opportunity Assessment",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Not every process should be automated — a simple framework for judging whether a candidate process is actually a good fit.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "List the characteristics that make a process a good vs. poor automation candidate",
      "Apply a simple decision framework to assess whether a process is ready to automate",
      "Explain why automating a bad or unclear process usually makes things worse, not better",
    ],
    simpleExplanation:
      "Good automation candidates are repetitive, rule-based, predictable tasks with structured input, done often. Poor candidates are highly judgment-based, constantly changing, unclear, very rare, or risky to run without a human checking it.",
    eli10:
      "Automating \"send the same reminder email every Monday at 9am\" is easy and safe. Automating \"decide whether this unusual customer complaint deserves a refund\" is not — that needs human judgment, not a fixed rule.",
    technicalExplanation:
      "A practical assessment weighs several dimensions: repetitiveness (does this happen often enough to be worth automating?), rule-based clarity (can the decision logic be expressed as explicit conditions?), input structure/reliability (is the data consistently formatted and available?), frequency and volume (low-frequency, low-volume tasks rarely justify build/maintenance cost), and ambiguity/risk (does this require human judgment, or carry consequences serious enough to require human review before acting?). A simple framework: can it be standardized? Is the input reliable? Are the business rules genuinely clear? Are the exceptions well understood? Is the ongoing maintenance worth it relative to the time saved? A \"no\" on several of these is a strong signal to improve the process first, or to automate only part of it (e.g. gather and route information automatically, but keep the actual decision with a human).",
    businessPurpose:
      "Automation has an ongoing cost — build time, and later maintenance, monitoring, and troubleshooting whenever something upstream changes. Automating the wrong process wastes that cost and can create a fragile system that fails in ways nobody expects, because the underlying process was never well understood in the first place.",
    commonProblems: [
      "A highly judgment-based decision is automated with rigid rules, producing wrong outcomes on cases the rules didn't anticipate.",
      "A rarely-run process is automated anyway, and the maintenance cost over its lifetime exceeds the manual time it ever saved.",
      "A process with unreliable, inconsistently-formatted input is automated without first fixing the input problem, producing frequent failures.",
    ],
    troubleshootingSteps: [
      "Score the candidate process against repetitiveness, rule clarity, input reliability, frequency/volume, and ambiguity/risk.",
      "If business rules or exceptions aren't yet well understood, treat that as a signal to finish As-Is/root-cause analysis first, not to automate around the gap.",
      "Consider partial automation — automate the mechanical parts (gathering, routing, notifying) while keeping a genuinely judgment-based decision with a human.",
      "Weigh expected build effort and ongoing maintenance against the time actually saved, not just against the annoyance of doing it manually.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This is a cost/benefit and feasibility analysis, the same discipline used before committing engineering effort to any feature." },
    ],
    practiceScenario: {
      scenario: "A colleague wants to automate a task that happens twice a year, involves reading unstructured free-text emails, and requires judgment about how to respond.",
      question: "Is this a strong automation candidate?",
      guidance: "No — low frequency, unstructured input, and judgment-based decisions are the three classic signs of a poor candidate. The build and maintenance cost is unlikely to be worth it; this is better left manual, or only partially automated (e.g. routing the email to the right person).",
    },
    questionToAskAtWork: "On the repetitiveness/clarity/reliability/frequency/risk scale, where does this process actually fall — and does that make it worth automating?",
    relatedTopicIds: ["standardization-and-value-adding-work", "to-be-process", "power-automate-fundamentals", "operational-kpi"],
    prerequisiteTopicIds: ["to-be-process"],
    keywords: ["automation candidate", "rpa vs workflow automation", "feasibility", "decision framework"],
  },
  {
    id: "bpo-method-lifecycle",
    title: "The BPO & Automation Lifecycle",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 8,
    shortDescription: "The full end-to-end framework this whole learning path is built around — from understanding a problem to iterating after deployment.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Recite the full BPO & Automation lifecycle in order",
      "Explain why skipping straight to \"build\" is the single most common cause of failed automation projects",
      "Locate any other topic in this learning path within this lifecycle",
    ],
    simpleExplanation:
      "This is the master roadmap the rest of this learning path follows, step by step: understand the problem, map how it works today, find the pain points and their real causes, write down what's actually needed, design the improved version, decide what (if anything) to automate, build it, test it thoroughly, deploy it carefully, watch it, measure whether it actually helped, and keep improving it.",
    eli10:
      "It's the recipe for fixing a broken process, in order: figure out what's actually wrong, watch how it's done now, find the annoying part, ask why it's annoying, decide what a better version looks like, build that better version carefully, test it before trusting it, roll it out gently, keep an eye on it, and check afterward whether it actually got better.",
    technicalExplanation:
      "The lifecycle: (1) Understand the Problem — what's actually being reported, by whom; (2) Map the As-Is Process — document current reality; (3) Identify Pain Points — find friction and bottlenecks with evidence; (4) Find Root Causes — go past symptoms (e.g. via the 5 Whys); (5) Define Requirements — capture functional and non-functional needs; (6) Design the To-Be Process — the improved target, traceable to root causes; (7) Decide What Should Be Automated — apply the automation opportunity assessment; (8) Build / Configure — implement the flow or process change; (9) Test Normal + Exception Cases — validate both the happy path and failure modes; (10) Deploy Carefully — roll out with a fallback plan, not all at once blindly; (11) Monitor — watch run history and behavior after go-live; (12) Measure Improvement — compare against a baseline, not just \"it feels better\"; (13) Iterate — revisit as the business or process changes, since this is a cycle, not a one-time project. The single most important discipline this lifecycle enforces: **do not automate a process you don't yet understand** — skipping straight from \"problem\" to \"build\" is the most common cause of an automation that technically works but doesn't actually solve the real issue, or that breaks the first time an unanticipated case appears.",
    businessPurpose:
      "A shared, repeatable lifecycle turns \"automate this\" from an ad-hoc, risky request into a structured project with checkpoints — reducing the chance of building the wrong thing, missing exceptions, or shipping something nobody can maintain.",
    commonProblems: [
      "Steps 8-10 (Build, Test, Deploy) happen with little or no work done on steps 1-7 first.",
      "Testing (step 9) only covers the happy path, skipping exception cases entirely — see Exception Handling, Testing & Monitoring.",
      "Step 12 (Measure Improvement) never happens, so nobody actually knows whether the automation helped.",
      "The lifecycle is treated as one-and-done rather than something to revisit (step 13) as the underlying process changes.",
    ],
    troubleshootingSteps: [
      "If a project starts with \"can you build a flow that...\", ask which of steps 1-7 have already been done.",
      "Before deploying, confirm step 9 (testing) covered both normal and exception cases, not just the expected input.",
      "After deployment, confirm someone owns steps 11-12 (monitoring and measuring) — these are frequently the first steps skipped once a flow \"works.\"",
      "Treat a working automation as the start of an ongoing responsibility (step 13), not the end of the project.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors the full software development lifecycle — requirements, design, build, test, deploy, monitor, iterate — applied to a business process instead of a codebase." },
    ],
    practiceScenario: {
      scenario: "A colleague asks you to \"just build a flow\" for a recurring reporting task, without any prior process documentation.",
      question: "What's the right response, using this lifecycle?",
      guidance: "Push back gently and start at step 1-2: understand the problem and map the current As-Is process first. Building directly risks automating a broken or misunderstood process, which the lifecycle exists specifically to prevent.",
    },
    questionToAskAtWork: "Where in this lifecycle — understand, map, find pain points, root cause, requirements, design, automate, build, test, deploy, monitor, measure, iterate — is this project actually starting from?",
    relatedTopicIds: ["bpo-process-optimization", "as-is-process", "to-be-process", "automation-opportunity-assessment", "automation-governance-and-ownership"],
    prerequisiteTopicIds: ["bpo-process-optimization"],
    keywords: ["lifecycle", "framework", "methodology", "process improvement steps"],
  },
  {
    id: "requirements-gathering",
    title: "Requirements Gathering for Automation",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 8,
    shortDescription: "The specific questions to ask before automating anything, and the difference between functional and non-functional requirements.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Ask the core set of requirements-gathering questions before starting an automation build",
      "Distinguish functional requirements from non-functional requirements at a beginner level",
      "Explain why \"what happens if it fails?\" is a requirement, not an afterthought",
    ],
    simpleExplanation:
      "Before building anything, you need clear answers to: what starts the process, who does each step, what systems/files are involved, what information is needed, what rules decide what happens next, what exceptions occur, what currently goes wrong, how often and how much volume, what success looks like, what happens if the automation fails, and who owns/supports it afterward.",
    eli10:
      "Before building a treehouse, you'd ask: where does it start (which tree?), who's helping, what materials, what if it rains halfway through, how big does it need to be, and who's in charge of fixing it if a plank comes loose later. Skipping these questions is how you end up with a treehouse that falls apart.",
    technicalExplanation:
      "A practical requirements checklist for automation covers: the trigger (what starts the process), the actors (who performs each step today), the systems/files/tools touched, the required inputs, the business rules governing branching decisions, known exceptions and their frequency, current pain points and their volume/frequency, the definition of success, the required failure behavior (what should happen if the automation itself fails partway), and ownership/support after go-live. These split into two categories: functional requirements describe *what* the automation must do — the specific triggers, actions, conditions, and outputs; non-functional requirements describe *how well* it must do it — expected volume, acceptable latency, reliability/uptime expectations, who is notified on failure, and security/access constraints. Beginners commonly gather functional requirements thoroughly and skip non-functional ones almost entirely, which is exactly the gap that causes an automation to \"work\" in a demo but fail under real volume or when a dependency is unavailable.",
    businessPurpose:
      "Incomplete requirements are the most common reason a delivered automation doesn't match what was actually needed, or breaks on cases nobody thought to mention — cheap to fix on paper before building, expensive to fix after deployment.",
    commonProblems: [
      "The trigger is assumed rather than explicitly confirmed (\"I thought it ran every hour, not every day\").",
      "Exception handling and failure behavior are never discussed until the first real failure happens in production.",
      "Non-functional requirements (volume, reliability, who gets notified on failure) are never asked about at all.",
      "\"What does success look like?\" is never answered concretely, so there's no way to later confirm the automation actually helped.",
    ],
    troubleshootingSteps: [
      "Work through the checklist explicitly with the process owner and at least one executor: trigger, actors, systems, inputs, rules, exceptions, current problems, frequency/volume, success definition, failure behavior, ownership.",
      "Separate answers into functional (what it does) vs. non-functional (how reliably, how fast, at what volume, who's notified on failure).",
      "Write down assumptions explicitly and confirm them — don't leave anything implied.",
      "Revisit requirements if the As-Is/root-cause analysis surfaces something that changes the picture.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Functional vs. non-functional requirements is standard requirements-engineering vocabulary, applied here to a business automation instead of a software feature." },
      { area: "Databases", connection: "\"What information is required\" and \"what systems are involved\" usually map directly onto which tables/files an automation will need to read from and write to." },
    ],
    practiceScenario: {
      scenario: "A requirements conversation covers exactly what the automation should do when everything goes right, but nobody asks what should happen if a required file is missing, or who gets notified if the flow fails at 2am.",
      question: "What category of requirement was missed, and why does it matter?",
      guidance: "Failure behavior and notification-on-failure are non-functional requirements — missing them means the automation might fail silently, with nobody aware until the downstream impact is discovered, possibly much later.",
    },
    questionToAskAtWork: "What should happen if this automation fails partway through — and who finds out when it does?",
    relatedTopicIds: ["process-owner-stakeholders", "to-be-process", "exception-handling-testing-and-monitoring", "technical-business-translation"],
    prerequisiteTopicIds: ["to-be-process"],
    keywords: ["requirements gathering", "functional requirements", "non-functional requirements", "scoping"],
  },

  // ---------------------------------------------------------------------
  // Process Automation / Microsoft Power Automate
  // ---------------------------------------------------------------------
  {
    id: "power-automate-fundamentals",
    title: "Microsoft Power Automate Fundamentals",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "What Power Automate actually is, and the three main flow types it supports.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Explain what Power Automate is in one sentence, to a non-technical colleague",
      "Distinguish automated, instant, and scheduled cloud flows",
      "Recognize where Power Automate fits relative to a To-Be process design",
    ],
    simpleExplanation:
      "Microsoft Power Automate is a tool for building the rule: \"when X happens, automatically do Y.\" You connect a trigger (the X) to one or more actions (the Y) without writing traditional code.",
    eli10:
      "It's like a very literal robot assistant you can give simple instructions to: \"whenever a new form comes in, put it on this list and send me a message.\" It only does exactly what you tell it, exactly when you tell it to check.",
    technicalExplanation:
      "Power Automate is a cloud-based workflow automation platform: a flow is built from a trigger, one or more actions, and optionally conditions, loops, and variables, connected to different services (Microsoft or third-party) via connectors. Three common flow categories: an automated cloud flow starts from an event-based trigger (e.g. a new email arrives, a file is created); an instant cloud flow is started manually by a person (e.g. a button press); a scheduled flow runs on a fixed recurrence (e.g. every weekday at 08:00), independent of any specific event. Under the hood, actions execute in the order they're defined, each one can use the output of a previous action as input (via expressions), and every run is recorded in a Run History for later inspection.",
    businessPurpose:
      "Power Automate lets non-developers automate structured, rule-based tasks that would otherwise require custom software development — lowering the cost of automating a well-understood, well-scoped process (see Automation Opportunity Assessment).",
    commonProblems: [
      "A flow type is chosen without thinking about what should actually start it (event vs. schedule vs. manual button).",
      "Power Automate is treated as capable of arbitrary judgment, when it can really only follow explicit rules and conditions.",
      "A flow is built before the underlying process and requirements are actually understood (see the BPO lifecycle).",
    ],
    troubleshootingSteps: [
      "Confirm what should actually start the flow before building — an event, a schedule, or a manual trigger.",
      "Check the flow's Run History first when something doesn't behave as expected — it shows exactly what ran and what each step returned.",
      "Remember Power Automate follows explicit rules only — if a decision requires judgment, that step likely needs to stay with a human, or be simplified into explicit rules first.",
    ],
    universityConnections: [
      { area: "Programming", connection: "A flow is conceptually a program: a trigger is an event listener, actions are statements, conditions are if/else, and loops are exactly what they sound like." },
    ],
    practiceScenario: {
      scenario: "A colleague wants a flow that runs \"every time someone might have submitted a form, just in case\" rather than reacting to an actual event.",
      question: "What flow type and design would be better?",
      guidance: "An automated cloud flow triggered directly by the form submission event is more reliable and efficient than a scheduled flow polling \"just in case\" — react to the real event rather than guessing at a schedule.",
    },
    questionToAskAtWork: "For this automation, should it react to an event, run on a schedule, or be triggered manually by a person — and why?",
    relatedTopicIds: ["automation-opportunity-assessment", "triggers-and-actions", "business-automation"],
    prerequisiteTopicIds: ["automation-opportunity-assessment"],
    keywords: ["power automate", "cloud flow", "automated flow", "instant flow", "scheduled flow"],
  },
  {
    id: "triggers-and-actions",
    title: "Triggers & Actions",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Every flow has exactly one trigger that starts it, followed by a sequence of actions that do the work.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Explain the difference between a trigger and an action",
      "Recognize a trigger vs. an action in a described automation scenario",
      "Give at least three realistic trigger → action examples",
    ],
    simpleExplanation:
      "A trigger is the one thing that starts a flow (\"when a new email arrives\"). Actions are everything the flow does afterward (\"create a SharePoint item\", \"send a notification\"). One trigger, then as many actions as needed, in order.",
    eli10:
      "The trigger is the doorbell ringing. The actions are everything that happens after: you get up, walk to the door, and open it. The doorbell doesn't do any of that itself — it just starts the sequence.",
    technicalExplanation:
      "Every Power Automate flow has exactly one trigger — the event, schedule, or manual invocation that begins a run — followed by an ordered sequence of one or more actions. Common examples: trigger \"when a new email arrives\" → action \"create a SharePoint item\"; trigger \"when a Microsoft Form is submitted\" → action \"send an approval request\"; trigger \"every weekday at 08:00\" → action \"read rows and notify owners.\" Actions can reference the trigger's output and each previous action's output via dynamic content/expressions, chaining data through the flow. A flow cannot have more than one trigger; if a process genuinely needs to start from more than one kind of event, that typically means multiple separate flows, or one flow triggered by the more general of the two events.",
    businessPurpose:
      "Precisely defining the trigger is one of the most common places automation requirements go wrong — the wrong trigger produces a flow that runs at the wrong time, too often, or not at all.",
    commonProblems: [
      "The trigger fires more often than intended (e.g. on every field edit instead of only on item creation).",
      "An action is assumed to happen automatically that actually needed to be explicitly added to the flow.",
      "A trigger's exact firing condition (e.g. \"item created\" vs. \"item created or modified\") isn't checked carefully, causing unexpected extra runs.",
    ],
    troubleshootingSteps: [
      "When a flow behaves unexpectedly, check exactly which trigger condition is configured — not just what you intended it to be.",
      "Check Run History to see whether the flow ran when you expected it to, and how often.",
      "Confirm each action in sequence is actually configured, rather than assumed to happen implicitly.",
    ],
    universityConnections: [
      { area: "Programming", connection: "A trigger is an event handler; actions are the statements executed inside it, running in order and passing data forward — the same shape as any event-driven program." },
    ],
    practiceScenario: {
      scenario: "A flow is meant to notify a manager only when a new expense request over a certain amount is submitted, but it's currently notifying them on every single change to any expense request.",
      question: "What's most likely misconfigured?",
      guidance: "The trigger condition is too broad — it's likely set to fire on any item change rather than specifically on creation plus a value condition. Tightening the trigger (or adding a condition action right after it) fixes the over-notification.",
    },
    questionToAskAtWork: "What exactly is the trigger for this flow — and does it fire only when we actually want it to?",
    relatedTopicIds: ["power-automate-fundamentals", "conditions-and-branching", "common-power-automate-failure-patterns"],
    prerequisiteTopicIds: ["power-automate-fundamentals"],
    keywords: ["trigger", "action", "flow trigger", "cloud flow"],
  },
  {
    id: "conditions-and-branching",
    title: "Conditions & Branching",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "How a flow makes decisions — if/else logic, exactly like a program branching on a condition.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Read a Power Automate condition as if/else logic",
      "Explain what happens on each branch of a condition",
      "Recognize a common cause of a condition evaluating unexpectedly",
    ],
    simpleExplanation:
      "A condition checks something and does one thing if it's true, another if it's false — just like \"if it's raining, take an umbrella, otherwise don't.\" In Power Automate: IF shipment_status = \"Delayed\" THEN notify operations, ELSE continue.",
    eli10:
      "It's the flow asking a yes/no question and doing something different depending on the answer — just like you deciding whether to bring an umbrella based on whether it's raining.",
    technicalExplanation:
      "A condition action evaluates a boolean expression (often comparing a field's value, using operators like equals, contains, greater than) and splits the flow into a \"Yes\" branch and a \"No\" branch, each with its own sequence of actions — directly analogous to an if/else statement in any programming language. Conditions can be nested for more complex branching, and multiple conditions can be combined with AND/OR logic. A common source of confusion: comparisons are sensitive to exact data type and formatting (e.g. text \"Delayed\" vs. a differently-cased or trailing-whitespace value, or comparing a date stored as text against a date value), which can make a condition evaluate differently than a person reading it would expect.",
    businessPurpose:
      "Conditions are what let one flow handle multiple real-world scenarios (different statuses, thresholds, categories) instead of needing a separate flow for every case.",
    commonProblems: [
      "A condition compares text values with mismatched casing, spacing, or formatting, so a \"true\" case is evaluated as false.",
      "Only the \"Yes\" branch is built, and the \"No\" branch is left empty even though it needed its own handling.",
      "Nested conditions become hard to follow, hiding a logic mistake in a deeply nested branch.",
    ],
    troubleshootingSteps: [
      "Check the exact expression being compared in Run History — including its precise formatting, casing, and data type.",
      "Confirm both branches (\"Yes\" and \"No\") have the actions they actually need, not just the expected common case.",
      "Simplify nested conditions where possible, or add clear labels/comments, so branching logic stays readable.",
    ],
    universityConnections: [
      { area: "Programming", connection: "This is literally if/else branching — the same logic taught in any introductory programming course, just configured through a visual builder instead of written syntax." },
    ],
    practiceScenario: {
      scenario: "A condition checks IF Status = \"Delayed\", but a shipment genuinely marked delayed still doesn't trigger the notification.",
      question: "What's a likely cause worth checking first?",
      guidance: "The actual stored value probably doesn't match exactly — e.g. \"delayed\" (lowercase), \"Delayed \" (trailing space), or a different label entirely like \"Delay.\" Checking the exact value in Run History, rather than assuming it matches what's expected, is the fastest way to confirm.",
    },
    questionToAskAtWork: "What exact value is this condition comparing against, and have we confirmed the real data actually looks like that?",
    relatedTopicIds: ["triggers-and-actions", "loops-apply-to-each", "common-power-automate-failure-patterns"],
    prerequisiteTopicIds: ["triggers-and-actions"],
    keywords: ["condition", "if else", "branching", "boolean logic"],
  },
  {
    id: "loops-apply-to-each",
    title: "Loops: Apply to Each",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Repeating an action once per item in a list — Power Automate's version of a for-loop.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what an Apply to Each loop does in terms of basic programming iteration",
      "Identify when a flow needs a loop vs. a single action",
      "Recognize why nested loops can make a flow slow or hard to follow",
    ],
    simpleExplanation:
      "Apply to Each repeats a set of actions once for every item in a list — for example, once for every row in an Excel table with 50 rows: for each row, check a condition, then do something.",
    eli10:
      "If you have 50 letters to stamp, you don't do all 50 at once — you do the same steps (pick up a letter, stamp it, put it down) 50 times in a row. Apply to Each is doing that, once per item in a list.",
    technicalExplanation:
      "Apply to Each takes an array (e.g. rows returned from an Excel table, items from a list, results from a search) and executes its inner block of actions once per item, with access to that item's specific values inside the loop. This is directly equivalent to a for-each loop in general-purpose programming. Loops can be nested (a loop inside a loop), but each additional level multiplies the number of executions — a loop of 50 items containing a nested loop of 20 items each runs the inner block 1,000 times — which can make a flow slow, expensive, and hard to reason about. Where possible, filtering data before the loop (fewer items to iterate) or restructuring to avoid nesting is preferable to a deeply nested loop.",
    businessPurpose:
      "Loops are what let a flow process a whole dataset (a spreadsheet of rows, a batch of records) instead of only handling one item at a time — essential for most real reporting and batch-processing automations.",
    commonProblems: [
      "A loop processes far more rows than intended because the data wasn't filtered first.",
      "Nested loops make the flow slow, expensive, or difficult to debug when something goes wrong deep inside.",
      "A loop's per-item errors aren't handled, so one bad row can stop the whole batch rather than being skipped/logged and continuing.",
    ],
    troubleshootingSteps: [
      "Check how many items the loop actually iterated over in Run History versus how many were expected.",
      "Filter the input data before the loop wherever possible, rather than filtering inside every iteration.",
      "Avoid unnecessary nested loops — restructure the data or the flow if a loop-inside-a-loop can be avoided.",
      "Decide explicitly what should happen if one iteration fails: stop the whole flow, or skip and continue.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Apply to Each is a for-each loop, and nested loops here have the same performance implications as nested loops in any algorithm — cost grows with the product of both loop sizes." },
    ],
    practiceScenario: {
      scenario: "A daily flow reads a 500-row Excel table and, for each row, loops through a second list of 30 categories to find a match, before sending a notification.",
      question: "What's a concern with this design, and how could it be improved?",
      guidance: "The nested loop runs up to 15,000 times daily just for category matching — likely slow and resource-heavy. A lookup/filter action (matching directly rather than looping through all categories per row) would usually be far more efficient than a nested Apply to Each.",
    },
    questionToAskAtWork: "Does this flow use a nested loop, and could that be replaced with a filter or a direct lookup instead?",
    relatedTopicIds: ["excel-automation-patterns", "conditions-and-branching"],
    prerequisiteTopicIds: ["conditions-and-branching"],
    keywords: ["apply to each", "loop", "iteration", "for each"],
  },
  {
    id: "connectors-and-data-sources",
    title: "Connectors & Data Sources",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "How Power Automate reaches other services — Outlook, Excel, SharePoint, Teams, Forms, and more — and why permissions matter.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a connector and a connection are, and how they differ",
      "List common connectors used in enterprise automation, conceptually",
      "Explain why a broken or expired connection is a common flow failure",
    ],
    simpleExplanation:
      "A connector is Power Automate's way of talking to a specific service — Outlook, Excel, SharePoint, Teams, Microsoft Forms, OneDrive, a SQL database, or an HTTP API where allowed. A connection is a specific, authenticated link to that service, usually tied to one person's account and permissions.",
    eli10:
      "A connector is like a type of plug (a USB plug fits USB devices). A connection is a specific cable actually plugged in, owned by someone, that can stop working if that person's account changes or the cable gets unplugged.",
    technicalExplanation:
      "A connector defines the actions and triggers available for a given service (e.g. the Outlook connector exposes \"when a new email arrives,\" \"send an email\"), while a connection is the authenticated credential linking a specific flow to a specific account on that service. Connections typically belong to whoever created or last authorized them, which matters for governance: if that person's account is disabled, their password/MFA changes in a way that invalidates the token, or their permissions on the underlying resource change, every flow using that connection can start failing — often without an obvious cause from the flow's own configuration. Common connectors in enterprise automation include Outlook, Excel, SharePoint, Teams, Microsoft Forms, OneDrive, SQL, and HTTP/API connectors where an organization allows them — this app makes no assumption about which connectors any specific organization actually uses.",
    businessPurpose:
      "Understanding connectors and connections is essential for both building flows (you need the right permissions on the right service) and troubleshooting them (many \"random\" flow failures trace back to a connection issue, not the flow's logic).",
    commonProblems: [
      "A flow's connection is tied to one person, and it silently breaks when that person leaves, changes password, or loses access to the underlying resource.",
      "A flow needs permissions the connected account doesn't actually have on the target file/site/mailbox.",
      "An expired or revoked authentication token causes actions to fail with a permissions-looking error that isn't actually about the flow's logic at all.",
    ],
    troubleshootingSteps: [
      "When a flow fails unexpectedly, check the health of its connections first — not just the action's logic.",
      "Confirm the connection's account still has the necessary permissions on the specific file/site/mailbox involved.",
      "Prefer a connection owned by a role or service account over a specific individual's personal account, where the organization supports that, precisely to avoid the \"broke when someone left\" failure mode.",
    ],
    universityConnections: [
      { area: "Web Services", connection: "A connector is conceptually an API client/SDK for a specific service; a connection is the authenticated credential used to call that API — the same pattern as any REST API integration." },
    ],
    practiceScenario: {
      scenario: "A flow that's run reliably for months suddenly starts failing every run, with no logic changes made to the flow itself.",
      question: "What should be checked first, before assuming the flow's design is wrong?",
      guidance: "The connection itself — has the owning account's password/permissions changed, or has it lost access to the file/site/mailbox involved? A working flow suddenly failing with no logic change is a classic connection/authentication symptom, not a logic bug.",
    },
    questionToAskAtWork: "Whose account owns the connections this flow depends on, and what happens to the flow if that account changes?",
    relatedTopicIds: ["system-integration", "automation-governance-and-ownership", "common-power-automate-failure-patterns"],
    keywords: ["connector", "connection", "authentication", "permissions", "outlook", "sharepoint"],
  },
  {
    id: "excel-automation-patterns",
    title: "Excel Automation Patterns & Limitations",
    category: "BPO & Process Automation",
    level: "Intermediate",
    estimatedMinutes: 8,
    shortDescription: "The extremely common Excel-table-to-flow pattern, and the specific, practical limitations that cause most Excel automations to fail.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Describe the standard Excel table → List rows → Filter/check → Action pattern",
      "List the most common practical limitations of automating against Excel data",
      "Explain why an Excel range must be formatted as a Table before Power Automate can reliably use it",
    ],
    simpleExplanation:
      "A very common pattern: read a table of rows from an Excel file, filter or check the values you care about, then do something for each matching row — like sending a notification or updating another system. Excel is easy to start with, but has real limitations for automation that are worth knowing up front.",
    eli10:
      "It's like flipping through a class register: read each row (each student), check something about them, and act on the ones that match. That works great — until someone renames a column, or two people try to edit the register at the same time.",
    technicalExplanation:
      "The standard pattern is: an Excel table (a properly-defined Table object, not just a plain cell range) → \"List rows present in a table\" action → a filter or per-row condition check → an action per matching row (often inside an Apply to Each). Practical limitations worth planning around: Power Automate's Excel actions expect a genuine Table, not just data that looks tabular, so an un-converted range will behave unreliably or fail outright; column header names matter and are referenced by name, so a renamed column breaks any flow expecting the old name; concurrent editing (someone has the file open, or another process is writing to it at the same time) can cause read/write conflicts or stale data; large spreadsheets can hit performance and row-count practical limits, making flows slow or timing out; and missing or \"dirty\" values (blank cells, inconsistent formatting, unexpected text in a numeric column) are a very common cause of a flow failing partway through. For genuinely long-term, high-volume, multi-user data needs, Excel is often not the best underlying data store — a proper database or list-based system tends to be more reliable, even though Excel is a fine and common starting point.",
    businessPurpose:
      "Excel-based automation is extremely common in real organizations because Excel is already everywhere and easy for non-developers to maintain — understanding its limitations up front prevents building a flow that works in testing but fails unpredictably in production.",
    commonProblems: [
      "The Excel data was never converted into a proper Table, and List Rows behaves inconsistently as a result.",
      "A column gets renamed by someone maintaining the spreadsheet, and every flow referencing the old column name starts failing.",
      "Two people have the file open at once, or the flow reads while someone is actively editing, and results after that come back inconsistent.",
      "A blank or unexpectedly formatted cell in an otherwise clean spreadsheet causes the flow to fail partway through the loop.",
    ],
    troubleshootingSteps: [
      "Confirm the source data is a genuine Excel Table (not just a range that looks like one) before troubleshooting anything else.",
      "Check whether a column name changed recently if a previously-working flow suddenly can't find an expected field.",
      "Check for blank or malformed cells in the affected rows — this is one of the single most common causes of a mid-run Excel flow failure.",
      "Ask whether the file was open or being edited by someone at the time the flow ran, if results look inconsistent or stale.",
      "For high-volume or multi-user needs, consider whether Excel is still the right long-term data source, or whether a database/list would be more reliable.",
    ],
    universityConnections: [
      { area: "Databases", connection: "Excel-as-a-data-source has exactly the concurrency, schema-drift, and data-quality problems a real database with proper transactions and a fixed schema is designed to prevent." },
    ],
    practiceScenario: {
      scenario: "A daily flow that reads an Excel table and emails a summary has run fine for months. After someone reorganizes the spreadsheet and renames a column from \"Status\" to \"Current Status,\" the flow starts failing.",
      question: "What's the most likely cause, and how would you confirm it?",
      guidance: "The flow's List Rows / filter step almost certainly references the old column name \"Status\" by name — renaming it breaks that reference. Checking Run History for a \"column not found\"-style error, and comparing the flow's referenced column names against the current spreadsheet headers, would confirm it quickly.",
    },
    questionToAskAtWork: "Is the source data actually a proper Excel Table, and has anyone changed a column name or structure recently?",
    relatedTopicIds: ["loops-apply-to-each", "common-power-automate-failure-patterns", "connectors-and-data-sources"],
    prerequisiteTopicIds: ["loops-apply-to-each"],
    keywords: ["excel", "excel table", "list rows", "column rename", "data quality"],
  },
  {
    id: "approvals-and-notifications",
    title: "Approvals & Notifications",
    category: "BPO & Process Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A very common automation pattern: something happens, a person approves or rejects it, and the outcome is recorded and communicated.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Describe the standard trigger → approval → record/notify pattern",
      "Explain why duplicate or repeated notifications are a common approval-flow bug",
      "Recognize the concept of idempotency in plain terms",
    ],
    simpleExplanation:
      "A very common flow shape: a form is submitted, the flow gets a response, checks it's valid, sends it to someone for approval, and then records the result and notifies whoever needs to know — whether approved or rejected.",
    eli10:
      "It's a digital version of asking your parent for permission, waiting for a yes or no, and then telling everyone who's been waiting on the answer — automatically, instead of someone having to remember to pass the message along.",
    technicalExplanation:
      "A typical approval pattern: Form submitted → Get response details → Validate the data → Start an approval (assigned to a specific approver or group) → Wait for the response → Record the result (e.g. update a list/table) → Notify relevant people, with the notification content and next steps differing between the approved and rejected branches. A common real-world bug in this pattern is duplicate notifications — often caused by the flow re-triggering on updates it itself makes (an update-triggered flow that then updates the same item, re-triggering itself), or by the same event being processed more than once without a check for whether it was already handled. This connects to idempotency: designing an action so that running it more than once for the same input produces the same end result rather than a duplicate side effect (e.g. checking \"has this already been approved/notified?\" before acting, rather than blindly repeating the action).",
    businessPurpose:
      "Approval-and-notification flows are one of the most common categories of enterprise automation because they replace manual chasing-people-for-sign-off with a trackable, auditable digital record — but they're also a common source of the \"duplicate notification\" complaint if not designed carefully.",
    commonProblems: [
      "An update-triggered flow updates the same item it's watching, causing it to re-trigger itself repeatedly.",
      "The same approval event is processed more than once (e.g. due to a retry), sending the same notification multiple times.",
      "The rejected branch is left unbuilt or under-built, so rejections aren't recorded or communicated as clearly as approvals.",
    ],
    troubleshootingSteps: [
      "If notifications are duplicating, check whether the flow's own actions could be re-triggering its own trigger condition.",
      "Check Run History for multiple runs against the same item/event — that points to a repeat-processing problem, not a notification-logic problem.",
      "Add an explicit check (e.g. a status field) confirming an item hasn't already been processed before acting on it again — this is the practical way to make an action idempotent.",
      "Confirm both the approved and rejected branches are equally well-built and tested.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Idempotency — the property that repeating an operation has the same effect as doing it once — is a standard reliability concept in distributed systems and API design." },
    ],
    practiceScenario: {
      scenario: "An approval flow is triggered \"when an item is created or modified.\" After approval, the flow updates the item's status field — which itself counts as a modification.",
      question: "What's likely to go wrong, and why?",
      guidance: "The flow's own status update can re-trigger the same \"created or modified\" condition, causing it to run again on an item it just processed — a self-triggering loop that can produce duplicate notifications or repeated processing. Narrowing the trigger condition, or adding a check that the item hasn't already been processed, prevents this.",
    },
    questionToAskAtWork: "Could this flow's own actions accidentally re-trigger itself, and is there a check in place to prevent processing the same item twice?",
    relatedTopicIds: ["triggers-and-actions", "common-power-automate-failure-patterns", "exception-handling-testing-and-monitoring"],
    prerequisiteTopicIds: ["triggers-and-actions"],
    keywords: ["approval flow", "notification", "duplicate notification", "idempotency"],
  },
  {
    id: "exception-handling-testing-and-monitoring",
    title: "Exception Handling, Testing & Monitoring",
    category: "BPO & Process Automation",
    level: "Intermediate",
    estimatedMinutes: 9,
    shortDescription: "Planning for what goes wrong, not just what goes right — retries, timeouts, run history, and testing beyond the happy path.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "List common categories of exceptions an automation should plan for",
      "Explain the difference between testing normal, edge, and failure cases",
      "Describe practical Power Automate tools for exception handling: run history, Configure Run After, Scope, retry policy",
    ],
    simpleExplanation:
      "A flow that only handles the case where everything goes perfectly is incomplete. Real automations need a plan for: missing fields, duplicate records, a connector being temporarily unavailable, permission changes, rate limits, timeouts, and malformed input — and they need to be tested against those cases, not just the ideal one.",
    eli10:
      "If you only ever practiced a fire drill assuming every door works and every light is on, you wouldn't actually be ready for a real fire. Testing exceptions is practicing for when something doesn't go as planned.",
    technicalExplanation:
      "Exceptions worth explicitly planning for include: retries and transient failures, failed actions, timeouts, missing/blank fields, duplicate records, an unavailable connector, changed permissions, API/connector rate limits, and malformed input. Testing should cover three categories: normal cases (expected, valid input); edge cases (a missing value, an unexpected value, a duplicate row, zero rows returned, unusually large input); and failure cases (a connector unavailable, a permission failure, a source file missing). Validation compares expected output against actual output — evidence should exist before an automation is trusted with real, unsupervised use. Power Automate provides specific tools for this: **Run History** shows every past run and each action's inputs/outputs/status; **Configure Run After** lets an action run conditionally based on whether a previous action succeeded, failed, timed out, or was skipped, which is how a flow can branch into cleanup or notification logic on failure; a **Scope** action groups a set of actions together so error handling can be applied to the whole group at once; a **retry policy** on an action controls how many times and how it automatically retries on a transient failure before giving up; and logging (writing status/results somewhere reviewable) makes failures visible instead of silent.",
    businessPurpose:
      "An automation that silently fails is often worse than no automation at all, because people stop manually checking the thing it was supposed to handle — exception handling and monitoring are what keep a flow trustworthy over time, not just on day one.",
    commonProblems: [
      "A flow is tested only with clean, ideal input and never with a missing field, duplicate row, or malformed value.",
      "A failed action has no \"Configure Run After\" branch, so failures are silent — nobody is notified and nothing is logged.",
      "Retries aren't configured (or are configured too aggressively) for actions that call an external, occasionally-flaky connector.",
      "\"It worked in my test\" is treated as sufficient evidence of readiness, without testing edge or failure cases.",
    ],
    troubleshootingSteps: [
      "Before trusting a flow with real use, test it against normal, edge, and failure cases explicitly — not just the happy path.",
      "Add Configure Run After branches for critical actions so failures trigger a notification or logging step, not silence.",
      "Group related risky actions in a Scope so failure handling can be applied consistently to all of them.",
      "Review the retry policy on actions calling external connectors — appropriate for transient failures, not a substitute for handling a genuinely broken dependency.",
      "Compare expected vs. actual output directly during testing, not just \"did it run without an error.\"",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors exception handling, defensive testing, and observability practices in traditional software development — try/catch, unit/edge-case tests, and logging, applied to a low-code flow instead of written code." },
    ],
    practiceScenario: {
      scenario: "A flow that processes daily orders has run for months with no visible errors, but a stakeholder mentions some orders never seem to get processed.",
      question: "What's the most likely gap, and how would you check?",
      guidance: "The flow likely has no failure notification/logging — failed runs may be happening silently. Checking Run History directly (rather than relying on \"nobody complained\") would reveal whether runs are actually failing on certain orders, and adding a Configure Run After failure branch would make future failures visible instead of silent.",
    },
    questionToAskAtWork: "If this flow fails partway through a run, would anyone actually find out — and how quickly?",
    relatedTopicIds: ["requirements-gathering", "common-power-automate-failure-patterns", "troubleshooting-a-broken-flow", "application-monitoring"],
    prerequisiteTopicIds: ["approvals-and-notifications"],
    keywords: ["exception handling", "testing", "monitoring", "run history", "configure run after", "scope", "retry policy"],
  },
  {
    id: "common-power-automate-failure-patterns",
    title: "Common Power Automate Failure Patterns",
    category: "BPO & Process Automation",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "A reference list of generic, common reasons a Power Automate flow breaks — useful to scan whenever something stops working.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Recognize at least eight common generic causes of Power Automate flow failures",
      "Use this list as a starting checklist when a flow behaves unexpectedly",
      "Explain why most of these failures are environmental/data changes, not logic bugs in the original build",
    ],
    simpleExplanation:
      "Most Power Automate failures fall into a fairly short, recognizable list of generic causes — a wrong trigger condition, a broken connection, a renamed column, unexpected blank values, a self-triggering loop, throttling, or an owner account that changed. Knowing this list makes troubleshooting much faster.",
    eli10:
      "It's like a mechanic's checklist for \"car won't start\" — battery, fuel, spark plugs, starter motor. You don't need to guess randomly; you check the usual suspects first.",
    technicalExplanation:
      "Common generic failure patterns: a wrong or overly broad trigger condition; an infinite or self-triggering loop (the flow's own update re-triggers its own trigger); a stale or broken connector connection/authentication; a permissions change on the underlying resource; a missing or malformed Excel table; a renamed column the flow still references by its old name; unexpected null/blank values in required fields; date/time formatting mismatches (especially across time zones or locale formats); duplicate processing of the same item/event; an Apply to Each iterating over the wrong or unfiltered dataset; a condition evaluating differently than expected due to type/formatting mismatches; API/connector throttling or rate limits; the flow owner's account being changed, disabled, or losing license/permissions; hardcoded values (a specific email address, file path, or ID) that stop being valid as the organization changes; and simply no error handling at all, so a failure is silent. Most of these are environmental or data changes rather than a bug in the flow's original logic — which is exactly why ongoing monitoring and governance (see Automation Governance & Ownership) matter as much as the initial build.",
    businessPurpose:
      "A short, memorized checklist dramatically speeds up troubleshooting a broken flow — instead of guessing randomly, you can systematically rule causes in or out.",
    commonProblems: [
      "Troubleshooting starts by re-reading the flow's logic in detail, when the actual cause is almost always environmental (a changed account, a renamed column, an expired connection).",
      "A failure is assumed to be a one-off glitch and simply retried manually, without investigating the underlying cause, so it recurs later.",
      "A flow that \"used to work\" is assumed to still be logically correct, when something outside the flow itself has changed.",
    ],
    troubleshootingSteps: [
      "When a flow fails, check this list before re-reading the flow's logic line by line: trigger condition, connections, permissions, Excel table/column names, blank values, date formats, duplicate/self-triggering, throttling, owner account, hardcoded values.",
      "Check what changed recently in the surrounding environment (an account, a file, a column, a permission) rather than assuming the flow's original design broke on its own.",
      "Use Run History to see exactly which action failed and what its inputs/outputs were, rather than guessing.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "This is the same idea as a systematic troubleshooting checklist for a system that \"used to work\" — check what changed in the environment before assuming the original design is wrong." },
    ],
    practiceScenario: {
      scenario: "A colleague says, \"the flow just stopped working, I don't know why — nothing was changed.\"",
      question: "What's a reasonable first response, using this checklist?",
      guidance: "Ask what did change around the flow, even if it doesn't feel related — a renamed column, an account password reset, a moved file, a permission change. Nearly every item on this list is exactly that kind of environmental change, not a spontaneous logic failure.",
    },
    questionToAskAtWork: "Has anything changed recently around this flow — an account, a file, a column name, or a permission — even something that seems unrelated?",
    relatedTopicIds: ["excel-automation-patterns", "connectors-and-data-sources", "troubleshooting-a-broken-flow"],
    keywords: ["failure patterns", "common causes", "flow broke", "checklist"],
  },
  {
    id: "troubleshooting-a-broken-flow",
    title: "How to Troubleshoot a Broken Power Automate Flow",
    category: "BPO & Process Automation",
    level: "Intermediate",
    estimatedMinutes: 8,
    shortDescription: "A dedicated, step-by-step framework for diagnosing an existing flow that's failing — reinforcing this app's core \"don't guess, gather evidence\" principle.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Apply a 15-step framework to systematically troubleshoot a broken flow",
      "Explain why reproducing the failure and inspecting inputs/outputs comes before attempting a fix",
      "Connect this framework to the app's general Advanced Investigation troubleshooting mindset",
    ],
    simpleExplanation:
      "Don't guess — gather evidence. Understand what the flow is supposed to do, reproduce the failure, look at exactly what happened in Run History, check inputs and outputs at each step, check permissions and source data, test a small case, fix it, then re-test both the normal case and the exceptions before calling it done.",
    eli10:
      "It's the same idea as a doctor's checkup: don't just guess what's wrong — ask what changed, look at the actual symptoms, run tests, confirm the diagnosis before treating it, and check afterward that the patient is actually better.",
    technicalExplanation:
      "A practical framework: (1) understand expected behavior — what should this flow actually do; (2) reproduce the failure, if possible, rather than relying only on a report; (3) open Run History for the failing run(s); (4) find the specific failing or incorrect step, not just \"the flow failed\"; (5) inspect that step's inputs; (6) inspect its outputs; (7) check any relevant conditions and what they actually evaluated to; (8) check permissions and connection health; (9) check the source data for the specific case that failed; (10) test a minimal, isolated case reproducing just that scenario; (11) apply a fix; (12) retest the normal case to confirm nothing broke; (13) retest known exception cases too, not just the one that failed; (14) monitor future runs to confirm the fix holds; (15) document the change — what broke, why, and what was changed. This directly mirrors the app's broader Advanced Investigation principle: **don't guess, gather evidence** — the same scope → evidence → diagnose → resolve → verify → document shape used throughout this app's troubleshooting scenarios, applied specifically to a Power Automate flow.",
    businessPurpose:
      "A broken automation that \"worked before\" is a very common real-world situation — a repeatable troubleshooting framework turns that into a systematic process instead of trial-and-error guessing, which matters especially for a flow other people now depend on.",
    commonProblems: [
      "A fix is attempted before actually finding which specific step is failing.",
      "A fix is applied and only the originally-failing case is retested — the normal case and other exceptions are assumed to still work without checking.",
      "The fix is made but never documented, so the next person to touch the flow doesn't know what changed or why.",
    ],
    troubleshootingSteps: [
      "Confirm what the flow is actually supposed to do before assuming you know why it's broken.",
      "Find and inspect the specific failing step's inputs and outputs in Run History — don't guess which step is at fault.",
      "Check source data, permissions, and connections for that specific case before changing the flow's logic.",
      "After fixing, retest the original failure, the normal case, and known exception cases — not just the one that prompted the fix.",
      "Document what was wrong and what changed, so the fix and its reasoning aren't lost.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This is standard debugging methodology — reproduce, isolate, inspect state, form and test a hypothesis, fix, and regression-test — applied to a low-code flow." },
    ],
    practiceScenario: {
      scenario: "A colleague says a flow \"sometimes\" fails, with no clear pattern, and asks you to just restart it.",
      question: "What should happen before considering it fixed?",
      guidance: "Restarting addresses the symptom, not the cause. The framework calls for finding the specific failing step in Run History, inspecting its inputs/outputs for the failed runs, and identifying what's different about the cases that fail versus the ones that succeed — \"sometimes\" almost always has a pattern once you look at the actual evidence.",
    },
    questionToAskAtWork: "For a flow that's failing intermittently, what does Run History actually show about the runs that failed versus the ones that succeeded?",
    relatedTopicIds: ["exception-handling-testing-and-monitoring", "common-power-automate-failure-patterns", "root-cause-analysis", "escalation"],
    prerequisiteTopicIds: ["exception-handling-testing-and-monitoring"],
    keywords: ["troubleshooting", "debug a flow", "run history", "don't guess gather evidence"],
  },
  {
    id: "automation-governance-and-ownership",
    title: "Automation Governance & Ownership",
    category: "BPO & Process Automation",
    level: "Intermediate",
    estimatedMinutes: 8,
    shortDescription: "Why an automation needs a named owner, documentation, and a change process — and why flows quietly break months later without it.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "List what a healthy automation needs beyond just working code/configuration",
      "Explain several concrete reasons a working flow can break months after deployment",
      "Recognize governance gaps as a leading cause of \"it worked before, now it's broken\" situations",
    ],
    simpleExplanation:
      "A working automation isn't finished the day it's deployed. It needs a process owner (who cares if it stops working), a technical owner (who can actually fix it), documentation, monitoring, clear ownership of its connections/access, a way to handle future changes, and a backup plan — otherwise it quietly breaks later and nobody knows why, or who's supposed to fix it.",
    eli10:
      "A pet needs an owner even after the fun part of getting it is done — someone has to keep feeding it, notice if it's sick, and know what to do if that person goes on vacation. An automation is the same: someone has to keep looking after it.",
    technicalExplanation:
      "Sustainable automation requires: a **process owner** (accountable for whether the underlying business outcome is still being met); a **technical owner** (able to understand, modify, and fix the flow itself); **documentation** (what it does, why, and how it's configured); **monitoring** (someone actually watches for failures, not just hopes there are none); clear **access/connection ownership** (see Connectors & Data Sources — whose account the flow's connections depend on); a **change process** (what happens when the underlying process or systems change); and a **backup/continuity plan** (what happens if the flow is unavailable, or its owner is). This directly explains why automations that worked fine for a year can suddenly break: an employee who owned the connection leaves; a password or account policy change invalidates a token; a source file gets moved or renamed; a column or field name changes as part of an unrelated update; or the underlying business process itself changes and the flow's rules quietly stop matching reality. None of these are bugs in the original build — they're the predictable cost of an automation with no ongoing ownership.",
    businessPurpose:
      "An automation without clear governance becomes a liability rather than an asset: nobody notices when it silently fails, nobody can safely change it as the business evolves, and when it eventually breaks, nobody knows who's supposed to fix it or why it was built that way in the first place.",
    commonProblems: [
      "A flow is built by someone who later leaves, with no documentation and no other technical owner able to maintain it.",
      "A flow's connections all depend on one person's personal account, and it breaks the day that account changes.",
      "Nobody is explicitly responsible for noticing if the flow stops working, so failures go unnoticed for a long time.",
      "The underlying business process changes, but nobody updates the flow's rules to match, so it starts producing quietly wrong results.",
    ],
    troubleshootingSteps: [
      "For any existing flow, identify who the process owner and technical owner actually are — if neither is clear, that's the first gap to close.",
      "Check what documentation exists, and whether it still matches how the flow actually behaves today.",
      "Confirm someone is actually monitoring for failures, not just assuming silence means success.",
      "Ask what would happen to this flow if its current owner left tomorrow.",
      "When a long-stable flow suddenly breaks, check first whether an owner/account/permission/file/column changed recently — this is consistent with the previous topic's common failure list.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This mirrors why production software needs an on-call owner, documentation, and a maintenance plan — an automation is production software, even when it's built without traditional code." },
    ],
    practiceScenario: {
      scenario: "A flow that worked reliably for over a year suddenly stops, right around the time its original builder left the organization.",
      question: "What governance gap does this most likely reveal?",
      guidance: "No clear ongoing technical owner or documented ownership — the flow likely depended on that person's personal account/connections and understanding, with nobody else positioned to maintain it. This is a textbook illustration of why ownership and documentation matter as much as the original build.",
    },
    questionToAskAtWork: "If the person who built or maintains this automation left tomorrow, who would actually know how to keep it running?",
    relatedTopicIds: ["connectors-and-data-sources", "change-management", "bpo-method-lifecycle"],
    prerequisiteTopicIds: ["troubleshooting-a-broken-flow"],
    keywords: ["governance", "ownership", "documentation", "maintenance", "process owner", "technical owner"],
  },
];
