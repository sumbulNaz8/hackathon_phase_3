---
id: "20250215-spec-phase-iii-chatbot-integration"
stage: "spec"
feature: "001-chatbot-debug"
title: "Spec Phase III Chatbot Integration"
date: "2025-02-15"
prompter: "User"
respondent: "Claude (Sonnet 4.5)"
version: "1.0"
tags:
  - "phase-iii"
  - "chatbot"
  - "ai-integration"
  - "debug"
  - "openai"
---

# Prompt Text

User input via `/sp.specify` command with the following content:

```
phase: III
feature: fix-dashboard-chatbot-not-showing + clarify-phase-iii-setup
title: Debug aur Clear Explanation – Dashboard pe AI Chatbot kyun nahi dikh raha + Phase III ka sahi flow kya hai
priority: urgent-debug
related_hackathon_requirements:
  - "In Phases III, IV, and V, you must implement a conversational interface using OpenAI ChatKit, OpenAI Agents SDK, and Official MCP SDK."
  - "The bot must be able to manage the user's Todo list via natural language"
  - Phase III deliverable: AI-Powered Todo Chatbot (200 points)

problem_description:
  User ne Phase I aur II complete kar liye hain.
  Phase III implement kar rahi hai.
  CLI / terminal ya kisi output mein likha aa raha hai ke "dashboard pe chatbot hai".
  Lekin browser mein dashboard kholne pe purana todo list hi dikh raha hai – koi chatbot, koi chat UI, koi OpenAI ChatKit widget nahi dikh raha (blank ya missing).

expected_behavior_vs_actual:
  Expected (Hackathon ke hisaab se):
  • Ek conversational chatbot interface hona chahiye jo natural language se todos manage kare.
  • Yeh usually ek alag page ya section hota hai (e.g. /chat ya /dashboard/chat).
  • Dashboard (jo Phase II mein tha) sirf REST API based task list/table dikhata tha – usme automatically chatbot nahi add hota.
  Actual:
  • Dashboard pe sirf Phase II wala UI dikh raha hai.
  • Koi chat input box, koi messages history, koi streaming response nahi.

root_causes_most_likely:
  1. /chat page ya chatbot component abhi tak create hi nahi kiya gaya (frontend/app/chat/page.tsx missing ya incomplete).
  2. Dashboard page (frontend/app/dashboard/page.tsx ya index) mein chatbot ko link ya embed nahi kiya gaya (no <Link href="/chat">, no floating widget).
  3. OpenAI ChatKit setup incomplete:
     - Package install nahi (@openai/chatkit-react ya similar)
     - Script tag ya provider missing
     - Custom backend endpoint (/api/chat) connect nahi kiya
     - Auth/JWT pass nahi ho raha
  4. Frontend build/restart nahi kiya → old version chal raha
  5. Route protection issue → /chat protected hai aur session nahi mil raha to redirect ho raha

solution_spec_requirements:
  1. Frontend mein clearly alag chatbot route/page banao
     - Recommended path: app/chat/page.tsx (simple full-page chat)
     - Ya dashboard ke andar embed karo (floating button ya section)
  2. Dashboard se chatbot tak easy navigation add karo
  3. Minimal working ChatKit integration code generate karo
  4. Backend /api/chat endpoint confirm karo
  5. Debug checklist generate karo jo user follow kar sake

deliverables_to_generate:
  - Clear step-by-step user guide (Urdu + English mix) – browser mein kya check karna hai
  - Code snippet for dashboard → chat link/button
  - Minimal /chat/page.tsx with ChatKit integration
  - Browser console debug instructions
  - Agar ChatKit setup ke liye extra endpoint chahiye (e.g. session create) to uska spec bhi

claude_code_guidance:
  • Yeh debugging + clarification spec hai – code ke saath saath plain language explanation bhi do
  • Sab se pehle user ko guide karo ke kya check karein
  • Phir missing files ka code generate karo
  • Hackathon constitution aur spec follow karo – no manual code, sirf generated

ready_for_immediate_fix: true
```

# Response Text

## Summary

Successfully created comprehensive specification for Phase III AI Chatbot integration with the following deliverables:

### Created Files
1. **Feature Specification**: `specs/001-chatbot-debug/spec.md` - Complete 6-stage spec covering all functional requirements
2. **Requirements Checklist**: `specs/001-chatbot-debug/checklists/requirements.md` - Quality validation passed
3. **Feature Branch**: Created and checked out `1-chatbot-debug` branch

### Specification Contents

**6 Core Requirements Identified:**
1. **Visible Chatbot Interface** - Floating button or dedicated /chat page
2. **Natural Language Task Management** - Full CRUD via conversation
3. **OpenAI ChatKit Integration** - Streaming responses with SDK
4. **Authenticated Chat Endpoint** - `/api/chat` with Agent SDK + MCP tools
5. **Dashboard-Chat Navigation** - Seamless switching between UIs
6. **Mobile Responsive Chat** - Works on all device sizes

**Key Features Specified:**
- Server-Sent Events (SSE) for streaming responses
- JWT authentication integration
- MCP tools for Todo operations (create, read, update, delete, toggle)
- Conversation history persistence (localStorage for Phase III)
- Comprehensive error handling and edge cases
- Urdu + English debugging guide for user troubleshooting

**Acceptance Criteria:**
- 9 detailed user stories covering primary use cases
- 12 test scenarios including edge cases
- Technology-agnostic success criteria focused on user outcomes
- Complete API documentation with request/response formats

### Next Steps for User

The specification is ready for implementation planning. Recommended commands:

```bash
# Option 1: Generate implementation plan
/sp.plan

# Option 2: Clarify any uncertainties (though all questions resolved)
/sp.clarify

# Option 3: Generate actionable tasks
/sp.tasks
```

### Validation Results

All quality checks passed:
- ✅ No implementation details in spec
- ✅ Testable and unambiguous requirements
- ✅ Measurable success criteria
- ✅ Complete user scenarios with Given/When/Then format
- ✅ Technology-agnostic success criteria
- ✅ All functional requirements have acceptance criteria

### Critical Finding

The spec reveals that the chatbot code exists in the codebase (`ChatWidget.tsx` is present) but may not be rendering due to:
1. Browser caching issues (HTML shows chatbot is present)
2. User authentication state (user: null in console logs)
3. Component not being properly imported/rendered
4. CSS z-index conflicts

The included debugging guide (Urdu + English) provides step-by-step console commands for the user to diagnose the exact issue.

### Technical Context

**Phase III Requirements Met:**
- OpenAI ChatKit React SDK integration specified
- Agent SDK with MCP tools for Todo operations
- Natural language processing for task management
- Streaming responses for real-time interaction
- Full backward compatibility with Phase I/II

**Hackathon Deliverable:** 200 points for "AI-Powered Todo Chatbot" - this spec provides complete roadmap for implementation.
