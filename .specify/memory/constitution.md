<!-- SYNC IMPACT REPORT
  - Version change: 1.2.0 → 1.3.0
  - Modified principles: Rule of Separation (updated to include Next.js requirement), Rule of Isolation (retained), Tech Stack Integrity (updated with brown-yellow theme requirement), Auth Law (updated), Spec-First Development (retained)
  - Added sections: None
  - Removed sections: Additional Constraints (replaced with new constraints)
  - Templates requiring updates: .specify/templates/plan-template.md (⚠ pending), .specify/templates/spec-template.md (⚠ pending), .specify/templates/tasks-template.md (⚠ pending)
  - Follow-up TODOs: None
-->
# Todo App Constitution - Supreme Law

## Core Principles (Supreme Laws)

### Rule of Separation (SUPREME LAW)
Business logic kabhi bhi API routes (main.py) mein nahi likhi jayegi. Saara logic /skills folder mein 'Reusable Agent Skills' ke taur par hoga. Frontend components must be built using Next.js 16+ with App Router, following component-based architecture. Yeh hamari sabse important rule hai jo har haal mein follow ki jayegi.

### Rule of Isolation (SUPREME LAW)
Har database query mein user_id ka check lazmi hoga taake ek user doosre ka data na dekh sakay. Yeh hamari sabse important rule hai jo har haal mein follow ki jayegi.

### Tech Stack Integrity
Backend uses FastAPI + SQLModel + Neon DB. Frontend uses Next.js 16+ (App Router) + TypeScript (strict mode) + Tailwind CSS with custom brown-yellow theme as specified in the design guidelines.

### Auth Law
Saare endpoints protected honge aur JWT tokens verify karenge. Authentication flow includes signup/login with proper token storage and inclusion in all API requests.

### Spec-First Development
Koi bhi code tab tak change nahi hoga jab tak pehle /specs folder ki markdown files update na ho jayein.

## Additional Constraints

### Visual Identity Requirements
- **Primary Dark Brown:** #3E2723 (main backgrounds, headers)
- **Light Brown:** #8D6E63 (secondary elements, cards)
- **Accent Yellow:** #FFC107 (buttons, highlights, active states)
- **Light Yellow:** #FFE082 (hover states, subtle highlights)
- **Text on Dark:** #FFFFFF (primary text on dark backgrounds)
- **Text on Light:** #3E2723 (text on light backgrounds)
- **Success Green:** #66BB6A (completed tasks)
- **Error Red:** #EF5350 (delete actions, errors)

### API Integration Contract
All frontend-backend communication must follow the specified API contract with proper authentication headers and error handling.

### Component Architecture
Must follow the specified component hierarchy with AuthProvider, Layout, TaskForm, TaskList, TaskCard, and modal components.

### Code Quality Standards
- TypeScript strict mode (no `any` types)
- All components have proper types
- Error handling in all API calls
- Loading states for all async operations
- Consistent code formatting (Prettier)

## Development Workflow

All development follows the Spec-First approach where specifications in the /specs folder must be updated before any code changes are made. Implementation must follow the Phase II requirements including all core features and testing checklist items.

## Governance

This constitution serves as the Supreme Law governing all development practices in the project. The two Supreme Laws (Rule of Separation and Rule of Isolation) take precedence over all other principles and must be followed under all circumstances. All team members must adhere to these principles. Any changes to these principles require explicit approval from the project lead.

**Version**: 1.3.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-27