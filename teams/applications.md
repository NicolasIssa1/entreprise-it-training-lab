# Applications

Everything below the "What I Have Observed" section is **general enterprise IT
knowledge** — generic industry concepts about what a team of this type commonly does,
not a confirmed description of any specific DHL team's responsibilities, tools, or
scope. See `CLAUDE.md` for confidentiality rules.

## Simple explanation

The Applications team builds and supports the actual software employees and customers
use day to day — the programs, internal tools, and systems that sit on top of
Infrastructure's servers and networks.

## Technical explanation

Application teams typically manage:

- **Business applications** — internal tools (HR systems, logistics tracking,
  finance tools) and customer-facing software.
- **APIs** — interfaces that let different systems exchange data (e.g. a shipment
  tracking API used by a website and a mobile app).
- **Databases** — where application data is stored, queried, and managed.
- **Bugs** — defects in software behavior that need triage, reproduction, and fixing.
- **Integrations** — connecting separate systems together (e.g. an order system
  talking to a billing system).
- **Deployments** — releasing new versions of software into production safely.
- **Authentication** — verifying who a user is before letting them use an application
  (login, single sign-on).
- **Application monitoring** — tracking errors, performance, and usage of software in
  production.
- **Software lifecycle** — the stages software goes through: requirements, design,
  development, testing, deployment, maintenance.

## Why would a large company need it?

Large companies run on custom and off-the-shelf software for nearly everything —
tracking, finance, HR, customer service. That software needs to be built, integrated,
kept bug-free, and evolved as the business changes. Without a dedicated Applications
function, every department would be stuck with unreliable, unmaintained tools.

## Common responsibilities

- Fixing bugs reported by users or found through monitoring
- Building and maintaining integrations between systems
- Managing releases/deployments of new application versions
- Supporting APIs used internally or by partners
- Investigating "application is slow/broken" tickets
- Coordinating with Infrastructure when an app issue is actually a server/network issue

## Example problems

- An internal application throws an error when a user tries to submit a form.
- A business application is extremely slow during peak hours.
- An application can't connect to its database after a maintenance window.
- Two integrated systems fall out of sync because an API call silently failed.
- A new deployment introduces a bug that wasn't caught in testing.

## University connections

- **Software Engineering** ↔ lifecycle, testing, deployment practices
- **Web Services / REST APIs** ↔ how applications talk to each other
- **Databases / SQL** ↔ how application data is stored and queried
- **Web Development** ↔ building the business applications themselves
- **Secure Computing** ↔ authentication, authorization, secure API design
- **Algorithms** ↔ performance issues, optimizing slow application logic

## Learning checklist

- [ ] Can explain what an API is in one sentence
- [ ] Can explain the difference between a bug and an outage
- [ ] Can explain what a deployment is and why it can go wrong
- [ ] Can explain why an app might be "slow" for reasons unrelated to its own code
- [ ] Can explain authentication vs authorization
- [ ] Can describe the software lifecycle in 4–5 stages

## What I Have Observed During My Internship

No observations recorded yet — I have not yet rotated onto Applications. This section
will be filled in with only what I actually observe, once I do.

## Things I Still Want to Learn

- Which categories of tickets does this team receive most often?
- How do they find out an application issue is actually an infrastructure issue?
- What does their deployment/release process look like?
- Which tools does the team use day to day?
