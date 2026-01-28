# SKILL.md — Stack Interview

---
name: stack-interview  
description: Interview protocol for tech stack definition
---

## Objective
This skill guides the interview with the user to define the project's tech stack in a structured but unbiased manner.

---

## When to Use
- Tech stack is not defined in `.sdd-toolkit/requirements.md`
- User requests stack change
- Brownfield project needs to document existing stack

---

## Interview Principles

### Be Collaborative (Not Imposing)
Stack definition is a **joint decision**. You're not just an answer collector, nor a technology dictator.

**Your role:**
1. **Listen** to the user's preference
2. **Evaluate** if the choice is adequate for the project scope (consult `project.md`)
3. **Discuss** pros and cons when there are legitimate concerns
4. **Arrive together** at a decision that makes sense for both

**Examples of collaborative dialogue:**
- ✅ "You mentioned MongoDB. Considering the project has many relationships between entities (per project.md), a relational database like PostgreSQL could help. What do you think? Is there a specific reason for NoSQL?"
- ✅ "I understand you want to use React. Makes sense! For this project with many forms, have you considered any form management solution? No need to decide now, just for us to keep in mind."
- ❌ "MongoDB is not adequate. Use PostgreSQL." (imposing)
- ❌ "Ok, MongoDB." (too passive)

### Be Agnostic (But Informed)
- **DO NOT** list specific options as a choice menu
- **ASK** openly: "Which framework do you plan to use?"
- **EVALUATE** the response considering the project scope
- **DISCUSS** if you identify possible challenges, but **RESPECT** the user's final decision

### Be Efficient
- Group related questions when possible
- Maximum of 4-5 question rounds
- If user doesn't know, mark as "TBD" (to be defined)

---

## Interview Script

### Round 1: Frontend
> "Let's define the tech stack. Starting with **Frontend**:
> 1. Which framework/library do you plan to use? (or 'none' if server-side)
> 2. How do you plan to style? (Pure CSS, Tailwind, Styled Components, etc.)
> 3. Will you need state management? If so, which solution?"

### Round 2: Backend
> "Now for **Backend**:
> 1. Which programming language?
> 2. Which framework (if any)?
> 3. What API style? (REST, GraphQL, gRPC)
> 4. How will authentication work? (JWT, OAuth, sessions, etc.)"

### Round 3: Data
> "About **Database**:
> 1. Which primary database?
> 2. Will you use any ORM? Which one?
> 3. How will you manage migrations?"

### Round 4: Infrastructure (Optional)
> "Finally, **Infrastructure** (can skip if you don't know yet):
> 1. Will you use containers (Docker)?
> 2. Which CI/CD platform?
> 3. Where do you plan to host?"

---

## Response Handling

| User Response | Action |
|---------------|--------|
| Specific technology | Document as defined |
| "I don't know yet" / "TBD" | Document as "TBD" |
| "None" / "Not applicable" | Document as "N/A" |
| Unknown technology | Accept and document (don't question) |

---

## Output Format

After the interview, document in `requirements.md`:

```markdown
## 1. Tech Stack

### Frontend
- **Framework:** [response or TBD]
- **Styling:** [response or TBD]
- **State:** [response or N/A]

### Backend
- **Language:** [response]
- **Framework:** [response or None]
- **API:** [REST / GraphQL / gRPC]
- **Auth:** [response or TBD]

### Data
- **Database:** [response or TBD]
- **ORM:** [response or None]
- **Migrations:** [response or TBD]

### Infrastructure
- **Containers:** [response or TBD]
- **CI/CD:** [response or TBD]
- **Hosting:** [response or TBD]
```

---

## Notes
- This skill is called by the Requirements Engineer when the stack is not defined
- Never suggest specific technologies — let the user decide
- If the project is brownfield, also use the `detect-manifest` skill to validate
