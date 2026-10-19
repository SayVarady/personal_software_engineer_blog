---
title: "Introduction to ACID"
dur: "22 min"
diff: "beginner"
order: 1
---

ACID represents the four critical properties of relational databases (like MySQL, PostgreSQL, and Oracle) as well as modern NoSQL and graph databases. They are the core building blocks and principles used to design reliable database systems.

In this note, we will discuss their roles and why they are so important. But before diving in, we first need to understand the protagonist of the database world: the *Transaction*

## 1. What is a Transaction?

Consider this common real-world scenario where a user purchases an item. It requires updating a balance and reducing product stock:

```markdown
User table:
| id     | balance |
| -----  | ------- |
|  1     | 100     |

Stock table:
| id     | stock_balance |
| -----  | ------------- |
|  99    | 8             |
```



```sql
BEGIN;
-- 1. Deduct money from user balance
UPDATE users SET balance = balance - 50 WHERE id = 1;

-- 2. Deduct product from inventory
UPDATE products SET stock = stock - 1 WHERE id = 99;
COMMIT;
```

```markdown
User table:
| id     | balance |
| -----  | ------- |
|  1     | 50     |

Stock table:
| id     | stock_balance |
| -----  | ------------- |
|  99    | 7             |
```


So a **Transaction** is _a collection of queries_ that operate to achieve a _one single unit of work_. In simple word, it is an operation that consists of multiple queries to do one thing.

## 1.1 Transaction Lifespan
The transaction starts with the keyword *BEGIN* after that the operation with queries started working. Only when we are done and confirm that everything is worked the way we wanted, we use keyword *COMMIT* to save the new data to the *DISK* because the *transaction* is operating on a *RAM*. But what if everything is not what we intend to do? We have to rollback all the work using keyboard *ROLLBACK*

<!--```motion:diagram
type: transaction-lifecycle
title: "Interactive Architecture: RAM Buffer vs Physical Disk"
caption: "Figure 1.1: Live Architecture: Click 'Commit' to watch the packet flush to Disk, 'Rollback' to see instant 0ms discard, or 'Auto-Play' to watch the lifecycle."
```

```motion:steps
title: "Step-by-Step Flow: Transaction Progression"
caption: "Figure 1.2: Watch the glowing beacon advance as queries move through the transaction phases."
steps:
  - stage: "1. BEGIN"
    title: "Session Initialized"
    desc: "Transaction begins. A dedicated buffer pool in RAM is allocated for this session. Physical Disk remains untouched."
    tag: "RAM Allocation"
  - stage: "2. UPDATE Queries"
    title: "In-Memory Modifications"
    desc: "Balance and stock are updated inside RAM. Rollbacks can happen in 0ms without disk rewrites, and other readers are protected from uncommitted dirty data."
    tag: "Staging in RAM"
  - stage: "3. COMMIT / ROLLBACK"
    title: "Atomic Flush or Instant Undo"
    desc: "COMMIT writes all staged RAM changes atomically to persistent Disk. If an error occurs, ROLLBACK simply discards the RAM buffer."
    tag: "Disk Flush"
```-->

**Summary**:

• **BEGIN**: Signals the start of a transaction.

• **COMMIT**: Saves all changes made during the transaction permanently to the Disk.

• **ROLLBACK**: Undoes all changes made during the transaction if something goes wrong, reverting the database to its original state.

**Side Discussion**: Why wait until the end to COMMIT?

As I mentioned, a transaction only saves data to the disk at the very end. But why don't databases commit each query as soon as it succeeds during the transaction?

Cool, Let's discuss:

1. It is a nightmare to rolling back disk write. Because real-world transactions are complex. If a database committed early queries directly to the disk, and the final query suddenly failed (or the power cut out), the database would have to perform massive amounts of extra work to find, undo, and rewrite data on the physical disk. Keeping changes in the RAM makes an undo (Rollback) almost immediately.


2. We prevent broken, half-finished Data: If a database committed query-by-query, other users looking at the database mid-transaction would see broken, incomplete information (e.g., money deducted from a user, but the product stock not yet updated).


3. How disk is made that cause writing is slower than the ram: By bundling all queries into RAM and writing them to the disk all at once during the COMMIT, the database drastically optimizes performance. You may want to research on how the architecture of the DISK and RAM. I am only cover the operation on it for database systems.


For unexpected situation like, a crash during the commit or power failure during the commit. We will talk more during on the Advance section


## 2. Atomic (A from Acid)

Atomic follows the All-or-Nothing Rule for the database system to follow in order to implement it. With Atomic there are rules to follow:
1. All queries in a transaction must succeed
2. If one query fails, all the previous query and the entire transaction should rollback
3. If a database went down prior to a commit of a transaction. All the successful commit should rollback

Atomic transaction ensures the consistency of the data inside a database. Lack of atomicity is lack of consistency that would lead to an inconsistent data inside the database.

## 3. Isolation (I from acId)

In real-world application there are many transactions happen at the same time or there are many concurrency transaction. The question is if one user modified the data in the database. will other users that currently connected to the database see the change? What if the transaction is not yet commit? 

## 3.1 Read Phenomema

Example 1:
User A adds new client for the clients table
User B requests for a total clients that closed in the current month.
The transaction from user A got rollback.

Example 2:
User A adds new client for the clients table
User B requests for a total clients that closed in the current month.
The transaction from user A got committed.

All of these are called **Read Phenomena**: it is an unexpected behaviors that happens when multiple database transaction interfere with each other. There are:

- **Dirty Reads**: Refers to a read transaction that read the data during other transaction. In simple term, you read the uncommited data.
- **Non-Repeatable Reads**: You read the inconsistent data
- **Phantom Reads**: There is a new value being added after you read the data
- **Lost Updates**: The value had been modified after you read it. You read the old value

## 3.2 Isolation Level

Isolation was created to solve these issues. There are isolation levels each handle specific problem:

- **Read uncommitted**: No isolation level, any change from outside will is visible to the transaction, regardless of committed or not.
- **Read committed**: Each query of a transaction only read the committed change.
- **Repeatable read**: The transaction is making sure that when it read a value from that row. The row remains unchange until the transaction is finished.
- **Snapshot**: Each query of a transaction only sees changes that have been committed until the start a transaction. It is like a snapshot of a database at the moment. Eventhough there are new committed change during the transaction, It will just ignore it.
- **Serializable**: Transactions are run as if they serialize after one another.

So in short an Isolation is being implemented to solve the Read Phenomena:

Here are the isolation levels and read phenomena they solved:

```markdown
| Isolation Level  | Dirty           | Lost Updates   | Non-repeatable  | Phantom         |
| ---------------  | --------------- | -------------- | --------------- | --------------- |
| Read uncommitted | May occur       | May occur      | May occur       | May occur       |
| Read committed   | None            | May occur      | May occur       | May occur       |
| Repeatable Read  | None            | None           | None            | May occur       |
| Serializable     | None            | None           | None            | None            |
```

Database implementation of isolation
- **Pessimistic** Rows locks, table locks, page locks to avoid lost-updated. (Not allow to change anything)
- **Optimistic** No locks, just track if things changed, we return a fail transaction and retry again.
- **Repeatable Read** "Locks" the row it reads but it will consume a lot of resource if we read a lot of row.
- **Serializable** are usually implemented with optimistic concurrency control, we can implement it pessimistically with SELECT FOR UPDATE.

**Summary**: Isolation is an implementation that a transaction is running in a completedly isolated from a concurrency transaction.

## 4. Consistency (C from aCid)
Consistency refers the availability of correct information at the right times. It can be the consistency of the data and the consistency when you read the data. Consistency is sometimes trade-off for speed. In some scenerio where a value from one entity depends on the result of a transaction from another entity, so there is chance that we will get an inconsistent data or your data is corrupted. I will disucss in a more advance topic.

## 5. Durability (D from aciD)
Durability on the database system refers to ability to ensure that the data is persisted even if an expected situation happen like a system crashed or power outage...etc. In simple term, we ensure that once the data is committed it has to be there. But to do that, database system usually trade the speed with durability. 
- Changes made by a transactions must be persisted in a durable non-volatile storage (SSD, HDD)
- Durability techniques:
    - WAL - Write Ahead Log
    - Asynchronous snapshot
    - AOF
