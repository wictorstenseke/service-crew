# Workflow Guide: Reading Requirements

This document provides a quick reference for reading project requirements before starting work.

## Why This Matters

Service Crew is a well-documented project with clear requirements in the `requirements/` folder. Reading these requirements **before** starting any task ensures:

- ✅ Your work aligns with the project vision
- ✅ You follow established patterns and guidelines
- ✅ You don't implement out-of-scope features
- ✅ Your code is consistent with existing implementation
- ✅ You use the correct terminology and copy

## Quick Start: First Time Reading

If this is your first time working on the project, read in this order:

```bash
# 1. Project overview (5 min)
cat requirements/mvp/00-overview.md

# 2. Technical guidelines (10 min)
cat requirements/mvp/07-technical-guidelines.md

# 3. Storage patterns (5 min)
cat requirements/mvp/08-storage-and-storage-service.md
```

**Total time**: ~20 minutes for core understanding

## Task-Specific Reading

For specific features, add these to your reading list:

### Frontend/UI Work
```bash
cat requirements/mvp/01-landing-and-workshop.md   # Landing page
cat requirements/mvp/06-booking-card-and-details-modal.md  # Card UI
cat requirements/copy/copy-bank.md  # All UI text
```

### Business Logic
```bash
cat requirements/mvp/04-job-cards-and-planning.md  # Job cards
cat requirements/mvp/05-status-and-context-menu.md  # Status management
```

### Authentication/Users
```bash
cat requirements/mvp/02-mechanics-and-login.md
```

### Calendar Features
```bash
cat requirements/mvp/03-calendar.md
```

## Search Requirements

Find specific information quickly:

```bash
# Search for a specific term
grep -r "calendar" requirements/

# Search in MVP docs only
grep -r "StorageService" requirements/mvp/

# Case-insensitive search
grep -ri "drag and drop" requirements/
```

## Requirements Folder Structure

```
requirements/
├── mvp/              # MVP specification documents
│   ├── 00-overview.md
│   ├── 01-landing-and-workshop.md
│   ├── 02-mechanics-and-login.md
│   ├── 03-calendar.md
│   ├── 04-job-cards-and-planning.md
│   ├── 05-status-and-context-menu.md
│   ├── 06-booking-card-and-details-modal.md
│   ├── 07-technical-guidelines.md
│   ├── 08-storage-and-storage-service.md
│   └── 09-non-goals.md
├── copy/             # UI text and messaging
│   └── copy-bank.md
├── decisions/        # Architecture Decision Records
│   └── adr-001-localstorage.md
└── features/         # Future features (post-MVP)
    └── README.md
```

## Integration with GitHub Copilot

This repository has GitHub Copilot instructions configured in `.github/copilot-instructions.md`. When using Copilot:

1. Copilot will have context about the requirements folder
2. You can ask Copilot questions like:
   - "What are the technical guidelines for this project?"
   - "What text should I use for the login button?"
   - "What's in scope vs out of scope for MVP?"

## Agent Integration

For AI agents working on tasks, see `.github/agents/task-starter.md` for a complete workflow that ensures requirements are read before implementation starts.

## Checklist Template

Copy this checklist when starting a new task:

```markdown
## Requirements Review Checklist

- [ ] Read MVP overview (00-overview.md)
- [ ] Read technical guidelines (07-technical-guidelines.md)
- [ ] Read storage guidelines (08-storage-and-storage-service.md)
- [ ] Read relevant feature doc: _______________
- [ ] Checked copy bank for UI text
- [ ] Verified feature is NOT in non-goals.md
- [ ] Reviewed related ADRs (if any)
- [ ] Clear on implementation approach
```

## Tips

💡 **Bookmark these files** in your editor for quick access
💡 **Use split-screen** to keep requirements visible while coding
💡 **Update requirements** if you find gaps or inconsistencies (with team approval)
💡 **Reference requirement sections** in your PR descriptions
💡 **Keep it simple** - if something isn't in requirements, ask before adding it

## Common Questions

**Q: Do I need to read ALL requirements every time?**
A: No. Read core docs (overview, technical guidelines) first time, then only relevant feature docs for each task.

**Q: What if requirements conflict with existing code?**
A: Requirements are the source of truth. If code doesn't match, either update the code or discuss updating requirements.

**Q: What if something isn't documented?**
A: Ask for clarification and help document it. Don't assume or improvise.

**Q: Can I skip reading for small changes?**
A: Even small changes should align with requirements. At minimum, verify your change doesn't violate technical guidelines or non-goals.
