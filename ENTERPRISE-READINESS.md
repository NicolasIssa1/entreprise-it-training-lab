# Enterprise Readiness Notes

**This document does NOT claim the product is enterprise-ready today.** It exists to
document what would eventually need to exist before any real corporate deployment —
so a polished prototype is never mistaken for production enterprise software. Every
item below is a **future requirement**, not a current feature. As of Phase 1, none of
these are implemented; the app runs entirely locally with mock data and
`localStorage`, with no backend, no accounts, and no real data of any kind.

See `PRODUCT-ROADMAP.md` for when these might realistically be tackled (mostly
Phases 5, 9, and 10) and `CLAUDE.md` for the confidentiality rules that apply in the
meantime.

## Identity & access

- [ ] **Authentication** — real user accounts (currently: none, single implicit user)
- [ ] **Authorization** — per-user data access rules
- [ ] **Role-based access control (RBAC)** — different permissions for intern vs.
      manager vs. admin views
- [ ] **SSO** — integration with a company identity provider, if deployed inside an
      organization
- [ ] **Admin controls** — user management, content moderation, configuration

## Data & storage

- [ ] **Secure backend** — real database instead of `localStorage`
- [ ] **Encrypted storage** — data at rest and in transit
- [ ] **Data retention rules** — how long data is kept, and deletion policy
- [ ] **Company data classification** — a clear policy on what categories of data are
      (and are never) allowed into the system
- [ ] **Backups** — automated, tested backup/restore process

## Security & compliance

- [ ] **Security review** — formal review of the codebase and architecture
- [ ] **Vulnerability testing** — penetration testing / dependency scanning
- [ ] **Privacy / legal review** — especially before handling any real organizational
      or personal data
- [ ] **Audit logging** — who did what, when, for accountability
- [ ] **Incident response plan** — what happens if something goes wrong

## Operations

- [ ] **Hosting approval** — sign-off from whichever organization would host/approve
      the deployment
- [ ] **Monitoring** — uptime, error tracking, performance monitoring
- [ ] **Support model** — who fixes issues, what the SLA for the *product itself*
      would be (distinct from the in-app SLA training content)
- [ ] **Accessibility compliance** — a formal WCAG-level audit beyond the basic pass
      done in Phase 1

## Legal & business

- [ ] **Licensing / IP review** — clarity on ownership and usage rights, especially if
      pitched to or used by a company other than the one it was built during
- [ ] **Company branding approval** — explicit permission before using any real
      organization's name/branding beyond the current "not an official product of any
      company it references" disclaimer
- [ ] **Integration approval** — sign-off before connecting to any real company
      system, ticketing tool, or data source

## Why this document exists

It's easy for a well-designed prototype to *feel* production-ready before it
actually is. This checklist exists so that any future decision to pilot or propose
this product is made with a clear, honest picture of the gap between "polished
foundation" and "enterprise-grade software" — not by assumption.
