// Analytics derivation layer (Phase 8). Every function here is pure and reads
// only the same evidence already used by skillProgress.ts and
// recommendations.ts — no analytics database table, no second stored truth.
// See docs/ANALYTICS.md for the full architecture writeup.
export { computeTrainingOverview } from "./trainingOverview";
export { computeSkillAnalytics } from "./skillAnalytics";
export { computeQuizAnalytics, computeQuizAnalyticsEntry } from "./quizAnalytics";
export { computeInvestigationAnalytics, primaryCategoryForScenario } from "./investigationAnalytics";
export { computeLearningPathAnalytics } from "./learningPathAnalytics";
export { computeActivityTimeline, computeWeeklyActivityCounts } from "./activityTimeline";
export { computeTrainingSummary } from "./trainingSummary";
