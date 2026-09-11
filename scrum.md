# Scrum — Reference for building Phasewise

## Purpose

Working reference distilled from Jeff Sutherland & J.J. Sutherland's *Scrum: The Art of Doing Twice the Work in Half the Time* (2014), organized to guide how we build Phasewise — **the product itself AND the workflows Phasewise gives to landscape architecture firms**.

Phasewise is intended to be "a team" that supports its users. That framing has two implications:

1. **How we build it.** Every feature ships through Scrum-flavored cycles: small increments, working software, inspect + adapt, kill waste, plan reality (not fantasy). Sessions with Claude are Sprints.
2. **What we build.** Features encode these same principles for the firms using them: make work visible, keep feedback loops short, give people autonomy/mastery/purpose, reduce waste (Muri/Mura/Muda) in daily practice.

**Claude: review this file when scoping any new feature or workflow.** The [Claude Review Checklist](#claude-review-checklist) at the bottom translates the principles into concrete questions to ask before writing code, alongside the operating discipline already captured in `CLAUDE.md`.

Attribution: all "Takeaways" content is drawn from Sutherland & Sutherland's book; the framing, Phasewise application, and review checklist are our own working overlay.

## Living-doc convention

This file has two layers with different maintenance rules:

- **Stable (do not alter the substance).** The Takeaways sections, the OODA/PDCA/Shu Ha Ri cycle summaries, and the attribution line. These are the source-of-truth principles from the book. Formatting fixes are fine; rewording the meaning is not.
- **Living (edit freely as the project matures).** The "How this applies to Phasewise" mapping table + bullet lists, the "Claude Review Checklist", and the "Multi-industry note". These should evolve as we ship features, discover which practices actually stick, and learn where the framing needs sharpening. If a lesson from a session belongs here, add it and note the date/commit.

---

## Core cycles

### OODA — Observe, Orient, Decide, Act

Colonel John Boyd's decision loop. Applied to product work: know where you are, assess options, decide, act. **Speed of the loop matters more than the perfection of any single pass.** Getting inside a slower opponent's loop wraps them in their own confusion.

### PDCA — Plan, Do, Check, Act

W. Edwards Deming's continuous-improvement cycle. Every Sprint is one revolution of PDCA:

- **Plan** what to build.
- **Do** it.
- **Check** it against reality (Demo or Die — did it actually work for a real user?).
- **Act** on the check by changing what you'll do next.

### Shu Ha Ri

Learning stages: first learn the rules and forms (**Shu**), then innovate on them (**Ha**), then transcend them and act with all learning internalized (**Ri**). Applies to how we adopt Scrum — start by following the ceremonies faithfully, then evolve as the practice matures.

---

## The Takeaways — chapter by chapter

### Chapter 1 — The Way the World Works is Broken

- **Planning is Useful. Blindly following plans is stupid.** It's tempting to draw up endless charts, but when detailed plans meet reality they fall apart. Build into your working method the assumption of change, discovery, and new ideas.
- **Inspect and Adapt.** Every little while, stop doing what you're doing, review what you've done, and see if it's still what you should be doing and if you can do it better.
- **Change or Die.** Clinging to old command-and-control rigidity brings only failure. Competitors willing to change will leave you in the dust.
- **Fail Fast so you Can Fix Early.** Work that does not produce real value is madness. Working product in short cycles enables early user feedback and immediate elimination of wasted effort.

### Chapter 2 — The Origins of Scrum

Historical roots (Takeuchi & Nonaka's 1986 HBR paper "The New New Product Development Game"; Deming's PDCA; the paper-airplane team exercise for teaching Plan/Do/Check/Act in three six-minute cycles).

- **Hesitation is Death.** Observe, Orient, Decide, Act. Know where you are, assess your options, make a decision, and act.
- **Look Outward for Answers.** Complex adaptive systems follow a few simple rules, learned from their environment.
- **Great Teams Are** cross-functional, autonomous, and empowered, with a transcendent purpose.
- **Don't Guess.** Plan, Do, Check, Act. Plan what you're going to do. Do it. Check whether it did what you wanted. Act on that and change how you're doing things. Repeat in regular cycles for continuous improvement.
- **Shu Ha Ri.** First, learn the rules and the forms; once mastered, make innovations; finally, at heightened mastery, discard the forms and just be.

### Chapter 3 — Teams

Small, cross-functional, autonomous. Ideal size ~7 (3 minimum, 9 maximum before velocity drops). "More resources make the team go slower." Nelson Cowan's research: short-term memory holds ~4 distinct items, not 7. Brooks' Law: adding manpower to a late software project makes it later.

Sprint-cycle check-in questions:
1. What did you do since the last time we talked?
2. What are you going to do before we talk again?
3. What is getting in your way?

- **Pull the Right Lever.** Change team performance — that has orders of magnitude more impact than tuning individual performance.
- **Transcendence.** Great teams have a purpose greater than the individual.
- **Autonomy.** Give teams the freedom to decide how to act — respect them as masters of their craft. Improvisation makes the difference.
- **Cross-functional.** The team must have every skill needed to complete the project.
- **Small wins.** Small teams get work done faster than big teams. Rule of thumb: seven, plus or minus two. Err on the small side.
- **Blame is Stupid.** Don't look for bad people; look for bad systems that incentivize bad behavior and reward poor performance.

### Chapter 4 — Time

The Sprint: fixed short cadence, building working features one at a time.
- Backlog → To Do → Doing → **Done**.
- Put as many tasks from Backlog into Doing as can realistically finish in one Sprint.

Daily Stand-Up (15 minutes maximum):
1. What did you do yesterday to help the team finish the Sprint?
2. What will you do today to help the team finish the Sprint?
3. What obstacles are getting in the team's way?

Meeting rules: everyone present, same time daily, 15 minutes max, everyone actively participates. **"The greater the communication saturation, the more everyone knows everything — the faster the team."**

- **Time is Finite. Treat It That Way.** Break work down into what can be accomplished in a regular, set, short period — optimally one to four weeks. Call it a Sprint.
- **Demo or Die.** At the end of each Sprint, have something that's done — something that can be used.
- **Throw Away Your Business Cards.** Titles are specialized status markers. Be known for what you do, not how you're referred to.
- **Everyone Knows Everything.** Communication saturation accelerates work.
- **One Meeting a Day.** For team check-ins, once a day is enough. Fifteen minutes at the Daily Stand-up, see what can be done to increase speed, and do it.

### Chapter 5 — Waste is a Crime

Three types of waste (from Toyota / Taiichi Ohno):
- **Muri** — waste through unreasonableness (impossible demands, unsustainable pace).
- **Mura** — waste through inconsistency (uneven flow, context switching).
- **Muda** — waste through outcomes (defects, unused output, half-done work).

**Do one thing at a time.** Multitasking makes you slower and worse at both tasks. Half-done is essentially nothing at all — invested effort with no positive outcome.

- **Multitasking Makes You Stupid.** Doing more than one thing at a time makes you slower and worse. Don't do it. If you think this doesn't apply to you, you're wrong.
- **Half-done is Not Done.** A half-built car ties up resources that could create value. Anything "in process" costs money and energy without delivering anything.
- **Do It Right the First Time.** When you make a mistake, fix it right away. Stop everything else and address it. Fixing later can take 20+ times longer than fixing it now.
- **Working Too Hard Only Makes More Work.** Working long hours doesn't get more done; it gets less done. Fatigue → errors → rework. Work weekdays at a sustainable pace. Take a vacation.
- **Don't Be Unreasonable.** Challenging goals are motivators; impossible goals are just depressing.
- **No Heroics.** If you need a hero to get things done, you have a problem. Heroic effort is a failure of planning.
- **Enough with Stupid Policies.** Any policy that seems ridiculous likely is. Stupid forms, meetings, approvals, standards — fix them.
- **No Assholes.** Don't be one, and don't allow the behavior. Anyone who causes emotional chaos, inspires fear, or demeans others needs to be stopped cold.
- **Strive for Flow.** Choose the smoothest, most trouble-free way to get things done. Scrum is about enabling the most flow possible.

### Chapter 6 — Plan Reality, Not Fantasy

- **The Map is Not the Terrain.** Don't fall in love with your plan. It's almost certainly wrong.
- **Only Plan What You Need To.** Don't try to project everything out years in advance. Just plan enough to keep the team busy.
- **What Kind of Dog Is It?** Don't estimate in absolute terms like hours — humans are terrible at that. Size relatively (dog breeds, T-shirt sizes, Fibonacci sequence).
- **Ask the Oracle.** Use a blind technique like the Delphi method to avoid anchoring biases (halo effect, bandwagon effect, groupthink).
- **Plan with Poker.** Use Planning Poker to quickly estimate work.
- **Work Is a Story.** Think first about who'll get value, then what it is, then why they need it. Humans think in narratives: "As an X, I want Y, so that Z."
- **Know Your Velocity.** Every team should know exactly how much work they get done each Sprint — and how much they can improve by working smarter and removing barriers.
- **Velocity × Time = Delivery.** Once you know how fast you're going, you know how soon you'll get there.
- **Set Audacious Goals.** With Scrum it isn't that hard to double production or halve delivery time.

### Chapter 7 — Happiness

Sprint Retrospective questions (rate 1–5):
1. How do you feel about your role in the company?
2. How do you feel about the company as a whole?
3. Why do you feel that way?
4. What one thing would make you happier in the next Sprint?

Implement improvements right away; define success and check at the next Retrospective. Happiness for individuals and teams rests on **Autonomy, Mastery, and Purpose** (Dan Pink, *Drive*).

- **It's the Journey, Not the Destination.** True happiness is found in the process, not the result. Often we reward results, but we really want to reward striving toward greatness.
- **Happy is the New Black.** Happiness helps you make smarter decisions, be more creative, and stick with the work.
- **Quantify Happiness.** Measure it and compare it to actual performance. Other metrics look backward; happiness is a forward-looking metric.
- **Get Better Every Day — and Measure It.** At the end of each Sprint, pick one small improvement (*kaizen*) that will make the team happier. Make it the most important thing next Sprint.
- **Secrecy is Poison.** Nothing should be secret. Everyone should know everything, including salaries and financials. Obfuscation only serves people who serve themselves.
- **Make Work Visible.** A board that shows all work needed, what's being worked on, and what's actually done. Everyone sees it. Everyone updates it daily.
- **Happiness is Autonomy, Mastery, and Purpose.** Everyone wants to control their own destiny, get better at what they do, and serve a purpose greater than themselves.
- **Pop the Happy Bubble.** Don't get so happy that you start believing your own bullshit. Measure happiness against performance; if there's a disconnect, act. Complacency is the enemy of success.

### Chapter 8 — Priorities

**Product Vision** = intersection of (what you can implement) × (what you can be passionate about) × (what you can sell).

The Backlog contains everything that could possibly be in the product. Prioritize by: Big impact? Important to customer? Makes money? Easiest to implement? **Aim for revenue first**; find the 20% of input that yields 80% of output.

Three Scrum roles:
- **Product Owner** — what the work should be. Translates productivity to value.
- **Scrum Master** — how the work should be done.
- **Team Member** — does the work.

Build the **Minimum Viable Product**. Rapid prototyping, iterate with real users, test/test/test.

- **Make a List. Check It Twice.** List everything that could be done. Prioritize. Highest-value + lowest-risk items go to the top of the Backlog.
- **The Product Owner** translates vision into Backlog, and needs to understand the business case, market, and customer.
- **A Leader Isn't a Boss.** A Product Owner sets out what needs to be done and why. How and who is up to the team.
- **The Product Owner** has domain knowledge and the power to make final decisions, is available to answer questions, and is accountable for delivering value.
- **Observe, Orient, Decide, Act.** See the whole strategic picture, but act tactically and quickly.
- **Fear, Uncertainty, and Doubt** — better to give than receive. Get inside the competition's OODA loop.
- **Get Your Money for Nothing, and Your Change for Free.** Create new things only as long as they deliver value. Be willing to swap them out for things that require equal effort. What you thought you needed in the beginning is never what's actually needed.

### Chapter 9 — Change the World

- **Scrum Accelerates All Human Endeavors.** The type of project doesn't matter — Scrum can be used in any endeavor to improve performance and results.
- **Scrum for Schools.** Netherlands teachers using Scrum in high school saw >10% improvement in test scores across a range of students.
- **Scrum for Poverty.** In Uganda the Grameen Foundation used Scrum to deliver agricultural + market data to rural farmers — double the yield and double the revenue for some of the poorest people on the planet.
- **Rip Up Your Business Cards.** Free people to do what they think best and hold them responsible for the outcome.

---

## How this applies to Phasewise

### Building Phasewise (product development)

| Scrum concept | Our practice |
|---|---|
| **Sprint** | A working session with Claude, or a scoped feature ship (e.g. Fix A / Sentry alerting). Bounded by a clear Definition of Done. |
| **Product Owner** | Kevin. Decides what and why. Approves scope, priority, and any write to a live system. |
| **Scrum Master** | Claude, in coaching mode. Enforces spec-before-code, safety gates, backfill before commit, verification before "done". |
| **Team Member** | Claude, in execution mode. Writes the code, runs the migrations, drafts the emails. |
| **Backlog** | The Product Wishlist section of `CLAUDE.md` + "Next-session pick-ups (ranked)" lists at the bottom of each WWLO. |
| **Definition of Done** | tsc clean · committed · pushed · deployed · verified end-to-end (external curl, real send, dashboard confirmation) · WWLO note captured. |
| **Definition of Done — class-closure** | For any claim that a pipeline / system / class of failure is "proven working": N successful cases across M variance in inputs over T time, verified independently. One clean catch is one case, not a class-closure. Added 2026-09-08 after the 8/31 auto-bounce-detection "proved itself live" framing needed a walk-back once soft-to-hard escalation and a Sep 7 mailer-daemon variant both silently dropped. |
| **Definition of Done — diagnostic script** | Before running a scan-and-report script whose output shapes a decision, test the filter / regex / condition against known-good data (rows it should match AND rows it shouldn't). Cost: seconds. Prevents shipping a wrong count. Added 2026-09-08 after a `type === 'bounce'` filter missed `soft_bounce` entries and under-reported ReplyLog state to Kevin. |
| **Definition of Done — n8n Code node addendum** | Local unit tests + `vm.runInContext` sandbox tests that mock `$input.all()` directly cannot catch bugs in how `$input` resolves against the *actual* upstream node. `$input` in an n8n Code node returns items from the DIRECTLY UPSTREAM node — inserting a new intermediate node silently redirects `$input` and can drop every classifier iteration into the wrong data. Any n8n Code node change must include a live-tick production test (like Path 2 on 2026-09-11) before declaring victory, not just local vm equivalence. Fix pattern: use `$('Named Node').all()` explicitly whenever the code depends on a specific upstream node's output rather than the one immediately preceding. Added 2026-09-11 after v4's wrapper passed 14/14 fixtures + 5/5 real-message vm tests but emitted 0 items in n8n runtime for 31 consecutive ticks because `$input.all()` had shifted to Read SendLog (243 rows) when Read SendLog was inserted between Read ReplyLog and Classify Replies. |
| **Daily Stand-up** | Start of each session — recap where we left off, what's queued, what's blocking. |
| **Sprint Retrospective** | The WWLO write-up at session close. Captures what shipped, what surprised us, what didn't work, what changes next time. |
| **Demo or Die** | The verification step. Fix A shipped in skip mode → env var set → real curl confirmed 200 response with expected JSON. No feature is "done" without a demo. |
| **Velocity** | Tracked in WWLO commit tables + honestly-scoped effort estimates on future work. |
| **Kaizen** | Every WWLO ends with pickups ranked. Every session picks the highest-leverage one small improvement to focus on. |
| **Fail Fast, Fix Early** | Sentry alerting on Loops timeouts (`1556636`) + capture on `success:false` responses (`65c18f0`) — the goal is to see failures within seconds, not weeks. |
| **Waste elimination** | Middleware fix (`0812aab`) killed a class of double-gated cron routes so future testing takes minutes not hours. Reject anything that adds new toil the operator has to remember. |
| **Small teams / small increments** | Ship one commit at a time. Show diff. Get approval. Commit. Push. Verify. Move to the next. No batched multi-write approvals. |
| **Spec before code** | Fix A had a full spec (schema, cron logic, template variables, blast radius, effort) approved before I wrote a line. Not vibes. |

### Cadences

**Backlog grooming — quarterly.** Every ~3 months, walk the Product Wishlist in `CLAUDE.md`:
- Cut items that have aged out (no longer relevant, superseded by other work, or overtaken by events).
- Add acceptance criteria to items that only describe the problem, not the target end state.
- Re-rank remaining items by current value + risk.
- Cost: ~1 hour. Prevents the wishlist from bloating into write-only noise.

Added 2026-09-08 after acknowledging that Product Wishlist items from May 2026 were still open with no periodic re-rank. Next grooming: **2026-12-08**. If a session naturally lands near that date, that's a good stop-in-place moment.

### Phasewise as "a team" for landscape architecture firms

The product itself should encode Scrum principles for the firms using it. Every feature should be checked against:

- **Make work visible.** Dashboards, project health chips, sidebar badges, budget alerts, submittal ball-in-court, timesheet approval queue. If the operator has to hunt for what needs their attention, we haven't done the job.
- **Short feedback loops.** Budget alerts at 75/90/100%, submittal reminder cron, invite-expiry cron, auto-invoicing status panel, timesheet nudge to submit. Bring the signal to the person while the action is still cheap.
- **Autonomy.** Backup supervisors so a vacation doesn't stall approvals. Log time from anywhere. Manage your own team's leave policy. STAFF get a personal-context dashboard; OWNER/ADMIN get the firm-wide view. Nobody waits for a founder.
- **Mastery.** Keep the tool out of the way so architects focus on design. Kill screens they don't need. Auto-fill invoice numbers, auto-pull timesheets, auto-generate MWELO reports. The tool should feel like a competent junior colleague, not a form to fill out.
- **Purpose.** "Focus on the design. We'll handle everything else." Every UX decision either supports that promise or dilutes it.
- **Kill waste — Muri.** Impossible timelines. No feature should require the firm to work weekends to keep up with the tool.
- **Kill waste — Mura.** Inconsistent flows. Similar actions should behave similarly across projects, phases, users. Confirmation modals should look the same everywhere (see the 2026-05-08 modal sweep).
- **Kill waste — Muda.** Duplicate work. `TimeEntry.invoicedAt` prevents double-billing. `Invitation.reminderSentAt` prevents duplicate nag emails. Never make the operator do something the system could do for them.
- **Half-done is not done.** Work Plan dirty banner. Draft-invoice review modal. Don't let the operator ship half-baked artifacts to their clients.
- **Do it right the first time.** Un-approved-time warning before an invoice is created. Safety gates on the lfinn31313 backfill script. Fix the bug in the current invoice before it goes to the client.
- **Everyone knows everything.** Public invoice viewer with a shareable token. Team page shows who's on what. Transparency inside the firm.
- **Transcendence.** Firms should feel like Phasewise is on their team, not something they subscribe to.

---

## Claude Review Checklist

Before I write any code for a new feature or workflow, walk through this:

**Scope (Chapter 3, 4, 6)**
- Is this one Sprint of work, or does it need to be split?
- What's the smallest thing we can ship that delivers real user value?
- Am I estimating relatively (small/medium/large/XL), not in fake hours?

**Definition of Done (Chapter 4)**
- What does "done" look like — tsc clean, deployed, verified how?
- What's the "Demo or Die" step — the concrete moment I know it works for a real user?
- **Class-closure claim?** If this ships as "the X pipeline / system / class of failure is proven working," what's the criterion — N successful cases across M input variance over T time, verified independently? One clean catch is one case, not a class-closure.
- **Diagnostic script?** If this scan-and-report script's output will shape a decision, has the filter / regex / condition been tested against known-good data (rows it should match AND rows it shouldn't) before running?

**Waste check (Chapter 5)**
- **Muri:** Is the timeline reasonable, or am I signing up for impossible work?
- **Mura:** Does this behave consistently with similar flows in the app, or am I introducing inconsistency?
- **Muda:** Am I building something the user will actually use, or something that just sits there?
- Am I doing one thing at a time, or am I trying to batch multiple changes?

**Fail fast (Chapter 1, 8)**
- How will I know within minutes (not weeks) if this is broken in production?
- Is failure captured to Sentry with a filter I can alert on?
- Is there a manual salvage path if the automation fails?

**Value (Chapter 6, 8)**
- Who gets value from this? (write it as a user story: "As an X, I want Y, so that Z")
- Is this on the 20% of work that yields 80% of the output?
- Will we make money doing this?
- Is there a smaller MVP we should ship first and iterate?

**Encoding Scrum for the user (application layer)**
- Does this feature make work visible for the firm, or hide it?
- Does it give users autonomy or add a gatekeeper?
- Does it shorten a feedback loop for the firm's operator?
- Does it kill Muri/Mura/Muda in the firm's daily practice, or add new toil?
- Does it support the promise: "Focus on the design. We'll handle everything else."?

**Discipline (from CLAUDE.md operating model)**
- Have I written a real spec before writing code?
- Am I showing diff before committing?
- Am I getting explicit approval before any write to a live system?
- Will this add a WWLO note capturing what changed and why?

---

## Multi-industry note

The scale-out plan (Phasewise AE / CM / AG) inherits this same framing. Each new vertical adds industry-specific phase types, terminology, compliance, and integrations — but the Scrum-team-for-firms mental model transfers unchanged. Making work visible, killing waste, giving users autonomy/mastery/purpose is not landscape-architecture-specific. Build the LA vertical to embody these principles cleanly first, then port the pattern.
