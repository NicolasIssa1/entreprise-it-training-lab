/**
 * Fictional Enterprise Admin demo roster (Phase 12). Every name here is
 * generic and fictional — no real DHL employee, no real person, per root
 * CLAUDE.md's confidentiality rules. This file only authors each learner's
 * *engagement profile* (how strong/struggling/inactive they are) and which
 * built-in Programme/cohort they belong to; lib/data/admin/demoDataGenerator.ts
 * deterministically expands each entry into full, internally-consistent
 * fictional evidence (topic completions, quiz attempts, investigation
 * completions, automation lab builds) that flows through the SAME real
 * derivation engines every other page uses — nothing here is a fabricated
 * aggregate number.
 */

export type EngagementProfile = "strong" | "average" | "struggling" | "inactive" | "new";

export interface DemoLearnerSeed {
  id: string;
  name: string;
  engagement: EngagementProfile;
  cohortIds: string[];
  /** A real TrainingAssignment id (see lib/data/assignments.ts) or null. */
  programmeId: string | null;
  joinedDaysAgo: number;
}

export interface DemoCohortSeed {
  id: string;
  name: string;
  description: string;
}

export const demoCohortSeeds: DemoCohortSeed[] = [
  {
    id: "it-interns-2027",
    name: "IT Interns 2027",
    description: "A fictional demo cohort of enterprise IT interns, for illustrating the Enterprise Admin experience.",
  },
  {
    id: "graduate-tech-cohort",
    name: "Graduate Technology Cohort",
    description: "A fictional demo cohort of graduate-programme technology hires.",
  },
  {
    id: "university-enterprise-it-class",
    name: "University Enterprise IT Class",
    description: "A fictional demo cohort representing a university course using this platform for practical training.",
  },
];

export const demoLearnerSeeds: DemoLearnerSeed[] = [
  { id: "demo-ahmed-karim", name: "Ahmed Karim", engagement: "strong", cohortIds: ["it-interns-2027"], programmeId: "enterprise-it-intern-foundation", joinedDaysAgo: 52 },
  { id: "demo-priya-nair", name: "Priya Nair", engagement: "strong", cohortIds: ["it-interns-2027"], programmeId: "infrastructure-network-foundation", joinedDaysAgo: 48 },
  { id: "demo-liam-oconnor", name: "Liam O'Connor", engagement: "average", cohortIds: ["it-interns-2027"], programmeId: "applications-support-foundation", joinedDaysAgo: 45 },
  { id: "demo-sofia-rossi", name: "Sofia Rossi", engagement: "average", cohortIds: ["it-interns-2027"], programmeId: "enterprise-it-intern-foundation", joinedDaysAgo: 45 },
  { id: "demo-wei-zhang", name: "Wei Zhang", engagement: "struggling", cohortIds: ["it-interns-2027"], programmeId: "enterprise-automation-foundation", joinedDaysAgo: 40 },
  { id: "demo-fatima-alsayed", name: "Fatima Al-Sayed", engagement: "inactive", cohortIds: ["it-interns-2027"], programmeId: "business-logistics-technology-foundation", joinedDaysAgo: 60 },
  { id: "demo-daniel-kim", name: "Daniel Kim", engagement: "new", cohortIds: ["it-interns-2027"], programmeId: "enterprise-it-intern-foundation", joinedDaysAgo: 6 },
  { id: "demo-emma-johansson", name: "Emma Johansson", engagement: "strong", cohortIds: ["graduate-tech-cohort"], programmeId: "bpo-process-automation-foundation", joinedDaysAgo: 70 },
  { id: "demo-carlos-mendes", name: "Carlos Mendes", engagement: "average", cohortIds: ["graduate-tech-cohort"], programmeId: "infrastructure-network-foundation", joinedDaysAgo: 65 },
  { id: "demo-aisha-bello", name: "Aisha Bello", engagement: "struggling", cohortIds: ["graduate-tech-cohort"], programmeId: "applications-support-foundation", joinedDaysAgo: 58 },
  { id: "demo-noah-fischer", name: "Noah Fischer", engagement: "inactive", cohortIds: ["graduate-tech-cohort"], programmeId: "enterprise-it-intern-foundation", joinedDaysAgo: 90 },
  { id: "demo-yuki-tanaka", name: "Yuki Tanaka", engagement: "average", cohortIds: ["university-enterprise-it-class"], programmeId: "enterprise-automation-foundation", joinedDaysAgo: 30 },
  { id: "demo-grace-mensah", name: "Grace Mensah", engagement: "strong", cohortIds: ["university-enterprise-it-class"], programmeId: "business-logistics-technology-foundation", joinedDaysAgo: 35 },
  { id: "demo-lucas-dubois", name: "Lucas Dubois", engagement: "new", cohortIds: ["university-enterprise-it-class"], programmeId: null, joinedDaysAgo: 3 },
];
