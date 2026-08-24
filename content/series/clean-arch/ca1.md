---
title: "The Dependency Inversion Principle"
dur: "16 min"
diff: "intermediate"
order: 1
date: 2026-01-13
---

## The Problem with Concrete Dependencies

Most codebases start clean and gradually accumulate coupling. The classic symptom: a high-level business class imports a low-level infrastructure class directly. Your `UserService` creates a `PostgreSQLConnection` inside its constructor. It works — until it doesn't.

When the class is tightly bound to a specific database, you can't swap it out for testing. You can't replace Postgres with MongoDB without rewriting the service. You can't run your unit tests without a live database running. The dependency points **downward** from the business layer to the infrastructure layer, and that direction is the problem.

Robert C. Martin's Dependency Inversion Principle states two simple rules:

- **High-level modules should not depend on low-level modules.** Both should depend on abstractions.
- **Abstractions should not depend on details.** Details should depend on abstractions.

The key insight is about the *direction* of the dependency arrow. Inverting it means the infrastructure code implements an interface defined by the business layer — not the other way around.

## Applying Dependency Inversion

Click the button below to see the refactoring in action. Notice what changes: the service no longer creates its own database connection. Instead, it receives a **repository** through its constructor — an object that promises a `findById` method but says nothing about how it's implemented.

This is the essence of DIP: the high-level policy (user lookup logic) depends on an abstraction (the repository interface), and the low-level detail (PostgreSQL queries) depends on that same abstraction. The dependency arrow has flipped.

The practical impact is immediate. In your test suite, you inject a `MockUserRepo` that returns fixtures. In production, you inject a `PostgresUserRepo` that runs real queries. The `UserService` class never changes — it's genuinely decoupled.

## Try It Yourself

The playground below demonstrates both the coupled and inverted approaches. Edit the code freely — the output updates instantly. Try swapping the repository implementation or adding a new one to see how the service remains unchanged.

## Key Takeaways

- DIP is about **dependency direction**, not just using interfaces.
- The abstraction should be **owned by the high-level module**, not the low-level one.
- Constructor injection is the simplest way to apply DIP in most languages.
- The payoff is testability, swapability, and code that resists architectural rot.
- DIP is not dependency injection — DI is a *mechanism*; DIP is the *principle* that justifies it.
