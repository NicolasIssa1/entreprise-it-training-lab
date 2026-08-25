# Infrastructure

Generic enterprise IT knowledge — not DHL-specific. See `CLAUDE.md` for confidentiality
rules.

## Simple explanation

Infrastructure is the team that keeps the "computer stuff underneath everything"
running: the servers, storage, networks-adjacent systems, and cloud resources that
every business application depends on. If Applications builds the software people use,
Infrastructure builds and maintains the ground it stands on.

## Technical explanation

Infrastructure typically owns:

- **Servers** — physical or virtual machines that run applications and services.
- **Cloud** — provisioning and managing compute/storage/networking in providers like
  AWS/Azure/GCP, often alongside on-premises data centers (hybrid cloud).
- **Virtual machines (VMs)** — software-based computers running on a hypervisor,
  allowing many isolated systems to share one physical machine.
- **Operating systems** — installing, patching, and hardening Windows/Linux servers.
- **Storage** — disk arrays, SAN/NAS, backup storage, capacity planning.
- **Identity & access** — directory services (e.g. Active Directory-style systems),
  account provisioning, permissions.
- **Backups** — scheduled copies of data/systems so they can be restored after loss
  or failure.
- **Monitoring** — dashboards/alerts tracking server health, uptime, resource usage.
- **Availability** — designing systems to stay up (redundancy, failover, load
  balancing).
- **Disaster recovery (DR)** — plans and systems for recovering after a major outage
  (data center failure, ransomware, etc.).

## Why would a large company need it?

A multinational company runs hundreds of applications used by thousands of employees
and customers. None of that software works without reliable servers, storage, and
identity systems underneath it. Downtime in Infrastructure can cascade into every
application going down at once — so it's treated as foundational, high-stakes work.

## Common responsibilities

- Provisioning and decommissioning servers/VMs
- Patching operating systems and applying security updates
- Managing backups and testing restores
- Monitoring system health and responding to alerts
- Managing user/service identity and access permissions
- Capacity planning (storage, compute) for growth
- Disaster recovery planning and drills

## Example problems

- A server runs out of disk space and an application on it stops responding.
- A scheduled backup silently fails for a week and nobody notices until data is lost.
- A VM host loses power and everything hosted on it goes offline.
- An employee's account can't access a shared drive because of a permissions issue.
- A monitoring alert for high CPU usage turns out to be a runaway process.

## University connections

- **Operating Systems** ↔ how servers are patched, processes/resources managed
- **Networking** ↔ how servers communicate, load balancing, DNS resolution
- **Cloud concepts** ↔ VM provisioning, cloud storage, scaling
- **Databases** ↔ storage systems that databases run on top of
- **Secure Computing** ↔ identity/access management, patching for vulnerabilities
- **Algorithms** ↔ scheduling, load balancing, resource allocation logic

## Learning checklist

- [ ] Can explain the difference between a physical server and a VM
- [ ] Can explain what a backup is and why testing restores matters
- [ ] Can explain what "availability" means and one way to achieve it
- [ ] Can explain what disaster recovery is in one sentence
- [ ] Can name 3 things that could cause a server-side outage
- [ ] Can explain identity/access management in simple terms
