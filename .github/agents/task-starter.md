# Task Starter Agent Instructions

## Purpose
This agent configuration ensures that anyone (human or AI) starting work on a task in the Service Crew project always reads the requirements documentation first.

## Workflow for Starting Any Task

### Step 1: Read Core Requirements (MANDATORY)
Before writing any code or making any changes, you MUST read these documents in order:

1. **Project Overview**
   - File: `requirements/mvp/00-overview.md`
   - Why: Understand the project's purpose, scope, and overall vision
   - Key info: MVP goals, technical stack, core user flow

2. **Technical Guidelines**
   - File: `requirements/mvp/07-technical-guidelines.md`
   - Why: Learn coding standards, patterns, and technical constraints
   - Key info: React patterns, Tailwind usage, StorageService usage

3. **Storage Guidelines**
   - File: `requirements/mvp/08-storage-and-storage-service.md`
   - Why: Understand how data persistence works in this app
   - Key info: LocalStorage structure, StorageService API

### Step 2: Read Relevant Feature Requirements
Based on the task you're working on, read the relevant feature documentation:

- **Landing/Workshop features** → `requirements/mvp/01-landing-and-workshop.md`
- **Login/Mechanics features** → `requirements/mvp/02-mechanics-and-login.md`
- **Calendar features** → `requirements/mvp/03-calendar.md`
- **Job cards/Planning** → `requirements/mvp/04-job-cards-and-planning.md`
- **Status/Context menus** → `requirements/mvp/05-status-and-context-menu.md`
- **Booking UI** → `requirements/mvp/06-booking-card-and-details-modal.md`

### Step 3: Check Design Resources
For any user-facing text or UI elements:

- **Copy/Text** → `requirements/copy/copy-bank.md`
  - All user-facing text must come from here
  - Maintains consistent, playful tone

- **Architecture Decisions** → `requirements/decisions/`
  - Review relevant ADRs for context on technical decisions
  - Example: `adr-001-localstorage.md` explains why we use LocalStorage

### Step 4: Verify Non-Goals
Check `requirements/mvp/09-non-goals.md` to understand what is explicitly OUT of scope:
- Don't implement features that are listed as non-goals
- Don't add complexity that goes beyond MVP requirements

### Step 5: Create Implementation Plan
After reading requirements:
1. Summarize what you learned from the requirements
2. Outline how your task aligns with the requirements
3. Identify any constraints or guidelines that apply
4. Create a minimal implementation plan

## Quick Reference Commands

### View requirements structure
```bash
tree requirements/
```

### Search requirements for keywords
```bash
grep -r "search term" requirements/
```

### Read multiple requirements files
```bash
cat requirements/mvp/00-overview.md requirements/mvp/07-technical-guidelines.md
```

## Validation Checklist

Before starting implementation, confirm:
- [ ] I have read the MVP overview
- [ ] I have read the technical guidelines
- [ ] I have read the relevant feature requirements
- [ ] I understand the data storage approach
- [ ] I know which copy/text to use
- [ ] I have verified this is not a non-goal
- [ ] I have a clear implementation plan aligned with requirements

## Common Mistakes to Avoid

❌ **DON'T** skip reading requirements and start coding immediately
❌ **DON'T** implement features not specified in requirements
❌ **DON'T** use patterns or libraries not mentioned in technical guidelines
❌ **DON'T** make up UI text instead of using copy bank
❌ **DON'T** add backend/API calls (this is a LocalStorage-only app)

✅ **DO** read requirements first
✅ **DO** follow technical guidelines exactly
✅ **DO** use StorageService for all data operations
✅ **DO** maintain the playful, child-friendly tone
✅ **DO** keep implementation simple and aligned with MVP scope

## Support

If requirements are unclear or conflicting:
1. Document the ambiguity
2. Reference specific requirement documents
3. Ask for clarification before implementing
4. When in doubt, choose the simpler solution
