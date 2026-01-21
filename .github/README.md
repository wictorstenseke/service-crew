# .github Directory

This directory contains configuration and instruction files for GitHub integrations, AI agents, and workflow automation.

## Files in this Directory

### `copilot-instructions.md`
**Purpose**: Provides context and instructions for GitHub Copilot when assisting with code in this repository.

**What it does**:
- Explains the project structure and purpose
- Lists required reading (requirements documents) before starting work
- Defines the tech stack and design principles
- Provides workflow guidance for development

**Used by**: GitHub Copilot, GitHub Copilot Chat, and AI pair programming tools

### `WORKFLOW_REQUIREMENTS.md`
**Purpose**: A comprehensive guide for developers and AI agents on how to read and use project requirements.

**What it does**:
- Quick start guide for first-time contributors
- Task-specific reading lists
- Requirements folder structure explanation
- Search tips and checklists
- Integration guidance for tools and agents

**Used by**: Developers, AI agents, and anyone starting work on the project

### `agents/task-starter.md`
**Purpose**: Detailed instructions for AI agents that start work on tasks.

**What it does**:
- Mandatory reading checklist before coding
- Step-by-step workflow for starting tasks
- Validation checklist
- Common mistakes to avoid
- Clear dos and don'ts

**Used by**: AI coding agents, automation tools, and task management systems

## Why These Files Exist

The Service Crew project has well-structured requirements in the `requirements/` folder. These instruction files ensure that:

1. **Context is preserved**: AI assistants and new developers understand the project vision
2. **Requirements are followed**: All work aligns with documented specifications
3. **Quality is maintained**: Technical guidelines and patterns are consistently applied
4. **Scope is respected**: Features outside MVP non-goals aren't accidentally implemented
5. **Text is consistent**: UI copy comes from the copy bank

## How to Use These Files

### For Developers
- Read `WORKFLOW_REQUIREMENTS.md` when starting work on the project
- Reference `copilot-instructions.md` to understand what Copilot knows about the project
- Use the checklists in these files to ensure you've read relevant requirements

### For AI Agents
- Start with `agents/task-starter.md` for the complete workflow
- Follow the mandatory reading list before implementing any code
- Use validation checklists before submitting work

### For GitHub Copilot
- Copilot automatically reads `copilot-instructions.md`
- You can ask Copilot questions about project requirements
- Copilot will suggest code that aligns with project guidelines

## Maintaining These Files

These instruction files should be updated when:
- New requirement documents are added
- Project structure changes significantly
- Tech stack or patterns are updated
- Feedback shows instructions need clarification

Keep these files in sync with the actual `requirements/` folder content.

## Related Documentation

- **Main README**: `/README.md` - Project overview and getting started
- **Requirements**: `/requirements/` - All project specifications
- **MVP Overview**: `/requirements/mvp/00-overview.md` - MVP scope and vision
- **Technical Guidelines**: `/requirements/mvp/07-technical-guidelines.md` - Coding standards
