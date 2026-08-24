---
title: "Containers vs Virtual Machines"
dur: "10 min"
diff: "beginner"
order: 1
date: 2026-08-22
---

## "It Works on My Machine" Is a Packaging Problem

Every deployment headache that starts with "works locally, breaks in prod" is really the same problem in disguise: your local machine has a slightly different OS version, a different library installed globally, a different environment variable set — something the running code silently depends on that isn't actually part of the code. Containers and virtual machines are both answers to "how do I package an application with everything it depends on, so it behaves identically wherever it runs." They just answer it at very different levels.

## A VM Packages a Whole Computer

A virtual machine virtualizes hardware. A hypervisor carves out CPU, memory, and disk, and a full guest operating system boots on top of it — its own kernel, its own drivers, its own everything, independent of the host OS underneath. That's why a VM can run Linux on a Windows host, or vice versa: it's not sharing the host's kernel at all, it's simulating an entire machine from the ground up.

The cost of that completeness is size and boot time. Each VM carries a full OS image — gigabytes, not megabytes — and "starting" it means booting an operating system, which takes seconds to minutes, not milliseconds. Strong isolation, real overhead.

## A Container Packages an Application

A container takes a different bet: don't virtualize the hardware, share the host's kernel, and just isolate the process. Namespaces give the container its own view of the filesystem, network, and process list; cgroups limit how much CPU and memory it can use. What ships is your application plus its direct dependencies — libraries, a minimal filesystem — not an entire OS. That's why a container image is typically megabytes, not gigabytes, and "starting" it means starting a process, not booting a computer — milliseconds, not minutes.

The trade-off is the isolation is thinner: containers on the same host share that host's kernel, so a kernel-level vulnerability is a bigger blast radius than it would be across separate VMs. In practice, most teams run containers *inside* VMs anyway — cloud instances are VMs, and containers run on top of them — getting the strong isolation boundary at the VM layer and the fast, consistent packaging at the container layer.

## What This Actually Buys You

The real payoff isn't "containers are trendy," it's that the image *is* the environment. The exact same image that passed CI is the one that runs in staging and production — no "install these five packages first" step that can drift between environments. Combined with the CI/CD pipeline idea from the shipping series — build the artifact once, test it, deploy that exact artifact — a container image is usually *the artifact*. That's the piece that finally makes "works on my machine" a non-issue: there is no "my machine" version of the running code anymore, only the image.

## Key Takeaways

- VMs virtualize hardware and boot a full OS per instance — strong isolation, heavier and slower to start.
- Containers share the host kernel and isolate just the process — lighter, faster, thinner isolation boundary.
- Most production setups run containers inside VMs, combining both: VM-level isolation, container-level packaging speed.
- A container image being the literal build artifact — same bits in CI, staging, and prod — is what actually kills "works on my machine."
