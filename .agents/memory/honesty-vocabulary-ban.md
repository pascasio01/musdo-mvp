---
name: Honesty vocabulary ban (applies to negated copy)
description: Prohibited MUSVORA trust phrases must not appear in UI copy even in negated/disclaimer form.
---

The MUSVORA honesty rules forbid phrases like "Legally Verified", "Certified Ownership", "Guaranteed Recovery", "Final Legal Decision" in user-facing copy. This ban applies **even when the phrase is negated** — e.g. "Requires Confirmation, not Legally Verified Ownership" still fails review because the prohibited string appears on screen.

**Why:** Architect review blocks any occurrence of the banned string in UI copy regardless of surrounding negation; the phrase itself must never render. (Code comments documenting the rule, e.g. "never asserts 'Legally Verified'", are acceptable since they are not user-facing.)

**How to apply:** When writing disclaimers, use only the approved vocabulary positively — "Requires Confirmation", "Pending Verification", "Legal Review Recommended", "not a legal determination". Never construct a disclaimer by negating a banned term. Grep `Legally Verified|Certified Ownership|Guaranteed` under `src/pages/` before finishing a governance UI sprint.
