import { CompanyContext } from "@/lib/types";
import { PRODUCT_DISPLAY_MODE } from "@/lib/product";
import { internshipState } from "@/lib/data/internshipState";

/**
 * The single instance of CompanyContext in the app (see the type's own comment
 * in lib/types.ts). This is deliberately NOT a company-management feature — it
 * exists only to give the current internship's organization a designated,
 * clearly-labeled home, kept separate from the generic, company-agnostic
 * Business & Logistics curriculum (lib/data/learning/businessLogistics.ts).
 *
 * publicFacts must stay limited to information that is genuinely, generically
 * public knowledge about the kind of organization this is (see root CLAUDE.md's
 * confidentiality rules) — never an internal process, system, org detail, or
 * anything not explicitly told to Claude by Nicolas. `observations` is
 * deliberately left empty: actual personal observations always render live from
 * Daily Log entries (see TeamObservations.tsx / useDailyLogEntries), never
 * duplicated here.
 */
const companyContext: CompanyContext = {
  id: "current-internship-organization",
  name: internshipState.organization,
  disclaimer:
    "This is Nicolas's personal, private internship context — not official material from, or endorsed by, the organization named here. It is shown only in this app's private/local view and is never part of the public Enterprise IT Training Lab build.",
  publicFacts: [
    "A large, multinational logistics and delivery company, operating across multiple business divisions worldwide.",
    "Like most companies at this scale, day-to-day operations depend on many internal IT systems working together — the same general categories of technology (networking, applications, infrastructure) covered generically throughout this app's Learn library.",
  ],
  observations: [],
};

/**
 * Gated behind Local/Private mode (see lib/product.ts): a future public/shared
 * build of this product (PRODUCT_DISPLAY_MODE = "public") should never surface
 * personal internship organization context, so this returns null in that mode
 * rather than requiring every call site to remember the check itself.
 */
export function getCompanyContext(): CompanyContext | null {
  return PRODUCT_DISPLAY_MODE === "private" ? companyContext : null;
}
