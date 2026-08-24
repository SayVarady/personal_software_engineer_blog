---
title: "CI/CD: Turning Git Push Into a Deploy"
dur: "11 min"
diff: "beginner"
order: 1
date: 2026-08-22
---

## The Gap Nobody Warns You About

Every tutorial ends the same way: the code works on your machine, the tests pass, the feature is "done." Nobody tells you that's maybe sixty percent of the job. The other forty is getting that code onto a machine someone else's traffic actually hits, safely, repeatedly, without you personally running a checklist of manual steps at 11pm. That's what CI/CD is — not a buzzword, just the answer to "how does code become a running system, on purpose, every time."

Split it into the two things it actually is: **CI** (continuous integration) is the automated check that runs on every change — tests, linting, type checks — before anyone trusts it enough to merge. **CD** (continuous delivery/deployment) is the automated process that takes merged code and gets it running somewhere real. They're often the same pipeline, but they answer different questions: CI asks "is this safe to merge," CD asks "is this safe to run."

## Why Automate What You Could Do By Hand

The honest reason isn't speed, it's **consistency under pressure**. A deploy checklist followed correctly ninety-nine times out of a hundred will eventually be followed wrong at the worst possible moment — skipped step, wrong environment, stale branch. A pipeline runs the same steps every time, including the boring ones nobody wants to remember: run migrations, clear caches, restart workers, in the right order. The value isn't that a machine is faster than you; it's that a machine doesn't get tired, distracted, or brave enough to skip "just this once."

This is also why the pipeline itself deserves the same care as application code — versioned, reviewed, tested. A pipeline nobody understands is worse than no pipeline, because it fails silently and everyone assumes it's fine.

## What a Minimal Pipeline Actually Does

Strip away the vendor-specific YAML and every CI/CD pipeline is answering the same handful of questions, in order: Did the code change? Does it pass its checks? Is it allowed to go further (branch protections, approvals)? Build an artifact (a container image, a compiled binary, a bundle) — the exact same artifact that gets tested is the one that gets deployed, never rebuilt in between. Push that artifact to where it runs. Verify it's actually healthy once it's there, not just that the deploy command exited zero.

That last step — post-deploy verification — is the one most hand-rolled processes skip, and it's the one that turns "we deployed" into "we deployed and it's actually serving traffic correctly."

## Key Takeaways

- CI answers "is this safe to merge"; CD answers "is this safe to run" — often one pipeline, two different jobs.
- The value of automation is consistency under pressure, not raw speed — machines don't skip steps when they're tired.
- Build the artifact once, test that exact artifact, deploy that exact artifact — never rebuild between test and deploy.
- A deploy isn't done when the command exits zero; it's done when you've verified the thing is actually healthy in production.
