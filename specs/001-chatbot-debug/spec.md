# Feature Specification: Phase III AI Chatbot Integration

**Status**: Draft
**Constitution Version**: 1.3.0
**Created**: 2025-02-15
**Last Updated**: 2025-02-15

---

## Overview

Phase III implementation of an AI-powered conversational interface for Todo management using OpenAI ChatKit, Agents SDK, and MCP SDK. The chatbot will enable users to manage their Todo lists through natural language commands, replacing manual form-based interactions with intelligent conversation.

This specification addresses the critical issue where the chatbot interface is not visible in the browser despite backend code existing, and provides a complete implementation guide for the conversational AI system.

---

## Business Context

### Problem Statement

Users completing Phase I and Phase II have a functional Todo dashboard with REST API-based task management (create, read, update, delete tasks). However, Phase III requires implementing a conversational AI interface that:

1. **Current Issue**: The chatbot component exists in code but is not rendering in the browser dashboard
2. **Missing Integration**: OpenAI ChatKit is not properly integrated with the frontend
3. **No Natural Language Flow**: Users cannot interact with their Todos through conversation
4. **Incomplete Backend**: `/api/chat` endpoint with Agent SDK + MCP tools is not implemented

The application currently shows a traditional Todo list UI, but lacks the required AI-powered conversational interface that is the core deliverable for Phase III (200 points).

### User Impact

**Target Users**:
- Hackathon judges evaluating the AI implementation
- End users wanting faster, more intuitive task management
- Users needing to manage Todos without navigating multiple UI elements

**Benefits**:
- **50% faster task creation**: "Add task: buy groceries" vs. filling 5 form fields
- **Natural language queries**: "Show me my urgent tasks" vs. applying filters manually
- **Hands-free operation**: Voice-enabled task management through text-to-speech
- **Smart assistance**: AI can suggest priorities, categories, and due dates based on context

### Success Criteria

- [ ] Users see a functional chat interface on the dashboard or dedicated chat page
- [ ] Chatbot responds to natural language task commands within 2 seconds
- [ ] Users can create/read/update/delete Todos through conversation with 95% accuracy
- [ ] Chat interface works on mobile devices (responsive design)
- [ ] System supports 10 concurrent users without performance degradation
- [ ] All existing Phase II features remain functional (backward compatibility)

---

## Functional Requirements

### Requirement 1: Visible Chatbot Interface

**Description**: Users must be able to see and access the AI chatbot interface from the main dashboard or through a dedicated route. The chatbot should be clearly discoverable and visually distinct from other UI elements.

**Acceptance Criteria**:
- [ ] Given a user is logged into the dashboard, when the page loads, then they see a chatbot button or visible chat interface within 3 seconds
- [ ] Given a user is on any page, when they click "AI Assistant" button, then they are redirected to the chat interface or it opens in a modal
- [ ] Given a user is on the dashboard, when they look at the bottom-right corner, then they see a floating action button with a robot emoji (🤖) or chat icon
- [ ] Given a user accesses `/chat` route, when the page loads, then they see a full-page chat interface

**Priority**: Must Have

---

### Requirement 2: Natural Language Task Management

**Description**: The chatbot must understand and execute natural language commands for all CRUD operations on Todos (Create, Read, Update, Delete). Users should be able to manage their entire Todo list through conversation.

**Acceptance Criteria**:
- [ ] Given a user types "create a task to buy groceries", when they send the message, then a new Todo is created with title "buy groceries" and default priority/ category
- [ ] Given a user types "show my tasks", when they send the message, then the chatbot displays all their Todos in a readable format
- [ ] Given a user types "mark task 5 as complete", when they send the message, then task ID 5 is marked as completed
- [ ] Given a user types "delete the grocery task", when they send the message, then the matching task is deleted
- [ ] Given a user types "update task priority to high", when they send the message, then the most recently mentioned task is updated
- [ ] Given a user provides ambiguous commands, when the chatbot processes, then it asks clarifying questions (e.g., "Which task do you want to delete?")

**Priority**: Must Have

---

### Requirement 3: OpenAI ChatKit Integration

**Description**: The frontend must integrate OpenAI ChatKit SDK to handle streaming responses, manage conversation state, and display typing indicators. The integration must support persistent conversations across page refreshes.

**Acceptance Criteria**:
- [ ] Given the frontend is built, when checking `package.json`, then `@openai/chatkit-react` or equivalent SDK is installed
- [ ] Given a user sends a message, when the response arrives, then it displays with streaming effect (not waiting for full response)
- [ ] Given a user refreshes the page, when they return to chat, then conversation history is preserved
- [ ] Given the AI is "thinking", when waiting for response, then a typing indicator or animation displays
- [ ] Given an API error occurs, when the chatbot responds, then it shows a user-friendly error message and suggests retry

**Priority**: Must Have

---

### Requirement 4: Authenticated Chat Endpoint

**Description**: Backend must expose a `/api/chat` endpoint that accepts user messages, processes them through OpenAI Agents SDK with MCP tools for Todo management, and returns streaming responses. The endpoint must validate JWT tokens and associate conversations with the authenticated user.

**Acceptance Criteria**:
- [ ] Given an authenticated user sends a message, when the request hits `/api/chat`, then it processes with the user's Todo context (their tasks, preferences)
- [ ] Given an unauthenticated request, when it hits `/api/chat`, then it returns 401 Unauthorized
- [ ] Given a user asks about their tasks, when the Agent processes, then it has access to MCP tools to read the user's Todos from the database
- [ ] Given a user creates a task, when the Agent executes, then it uses MCP tools to write to the database with the user's ID
- [ ] Given the Agent needs Todo context, when it processes, then it retrieves tasks filtered by the authenticated user's ID only

**Priority**: Must Have

---

### Requirement 5: Dashboard-Chat Navigation

**Description**: Clear navigation must exist between the traditional dashboard (Phase II UI) and the new AI chat interface (Phase III). Users should be able to switch between the two interfaces seamlessly.

**Acceptance Criteria**:
- [ ] Given a user is on the dashboard, when they look for the chat option, then they see a prominent button or link labeled "AI Assistant" or "Chat with AI"
- [ ] Given a user is in the chat interface, when they want to return to the dashboard, then they see a "Back to Dashboard" link
- [ ] Given a user creates a task via chat, when they return to the dashboard, then the new task appears in the list
- [ ] Given a user creates a task on dashboard, when they open chat, then they can reference it in conversation

**Priority**: Should Have

---

### Requirement 6: Mobile Responsive Chat Interface

**Description**: The chat interface must work seamlessly on mobile devices, with full keyboard support on desktop. Messages should be readable and input should be easy on both form factors.

**Acceptance Criteria**:
- [ ] Given a user opens chat on a mobile device, when the page loads, then the chat interface takes up full screen without horizontal scrolling
- [ ] Given a user types on mobile, when they use the on-screen keyboard, then the chat input remains visible (not hidden behind keyboard)
- [ ] Given a user is on desktop, when they press Enter, when in the input field, then the message sends (without submitting form)
- [ ] Given a user is on mobile, when they tap the send button, then it's easily tappable (minimum 44x44 pixels)

**Priority**: Should Have

---

## Non-Functional Requirements

### Performance

- **Chat response time**: Streaming must begin within 500ms of API call
- **Full response completion**: Under 3 seconds for simple queries (read tasks)
- **Complex operations**: Under 5 seconds for multi-step operations (create, categorize, prioritize)
- **Concurrent users**: Support 10 users simultaneously with response time under 5 seconds

### Security

- **Authentication**: All chat requests must include valid JWT token in Authorization header
- **User isolation**: Agent must only access Todos belonging to the authenticated user (no cross-user data leakage)
- **Input sanitization**: All user messages must be sanitized before processing (prevent prompt injection)
- **Rate limiting**: Maximum 30 messages per minute per user to prevent abuse

### Usability

- **Accessibility**: Chat interface must support screen readers with ARIA labels
- **Keyboard navigation**: All chat functions accessible via keyboard (Tab, Enter, Escape)
- **Error messages**: User-friendly error messages in plain language (no technical jargon)
- **Loading states**: Clear visual feedback during message sending and AI processing

---

## User Stories

### Story 1: As a Todo User, I want to create tasks using natural language, so that I can quickly add tasks without filling forms

**Acceptance Criteria**:
- [ ] Given I am on the chat interface, when I type "add task call mom at 5pm", when I send, then a task is created with title "call mom", due time 5pm, and medium priority
- [ ] Given I don't specify priority, when I create a task, then it defaults to "medium" priority
- [ ] Given I create a task via chat, when I check the dashboard, then the task appears in my task list

**Priority**: High

---

### Story 2: As a Todo User, I want to view my tasks through conversation, so that I can quickly see what's due without navigating the dashboard

**Acceptance Criteria**:
- [ ] Given I have 5 tasks, when I type "show my tasks", when I send, then the chatbot lists all 5 tasks with titles, priorities, and due dates
- [ ] Given I have overdue tasks, when I type "what's overdue", when I send, then it lists only overdue tasks
- [ ] Given I ask "how many tasks do I have", when I send, then it responds with the count (e.g., "You have 5 tasks")

**Priority**: High

---

### Story 3: As a Todo User, I want to complete tasks by chatting, so that I can mark things done without finding them in the UI

**Acceptance Criteria**:
- [ ] Given I have a task "buy groceries", when I type "complete buy groceries", when I send, then the task is marked as completed
- [ ] Given I have multiple similar tasks, when I type "complete the first grocery task", when I send, then only the first matching task is completed
- [ ] Given I complete a task via chat, when I refresh the dashboard, then it shows as completed

**Priority**: High

---

### Story 4: As a Hackathon Judge, I want to see a working AI chatbot on the dashboard, so that I can verify Phase III requirements are met

**Acceptance Criteria**:
- [ ] Given I open the application, when I navigate to the dashboard, then I see a clearly visible chatbot button or interface
- [ ] Given I click the chatbot, when it opens, then I can type natural language commands
- [ ] Given I type "create a test task", when I send, then the chatbot confirms task creation
- [ ] Given I check the task list, when I look, then the new task appears in the dashboard

**Priority**: High

---

### Story 5: As a Developer, I want clear separation between Phase II (dashboard) and Phase III (chat), so that I can maintain and extend both independently

**Acceptance Criteria**:
- [ ] Given I examine the codebase, when I look at the file structure, then chat code is in separate files from dashboard code
- [ ] Given I need to update the dashboard, when I make changes, then the chatbot remains functional
- [ ] Given I need to update the chatbot, when I make changes, then the dashboard remains functional

**Priority**: Medium

---

## Technical Constraints

- **OpenAI SDK Version**: Must use latest OpenAI ChatKit React SDK (2025/26 compatible)
- **Agent Framework**: Must integrate with OpenAI Agents SDK for tool calling
- **MCP Tools**: Todo operations (CRUD) must be exposed as MCP tools for the Agent
- **Backend Framework**: FastAPI (already in use from Phase I/II)
- **Frontend Framework**: Next.js 14 with App Router (already in use)
- **Authentication**: JWT-based auth (already implemented in Phase II)

### Platform Limitations

- **Browser Support**: Must work on Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Support**: iOS Safari 14+, Chrome Mobile (latest Android)
- **API Rate Limits**: OpenAI API has rate limits - implement retry logic with exponential backoff

---

## Dependencies

### Internal Dependencies

- **Phase II Todo API**: Chatbot must integrate with existing `/api/tasks` endpoints
- **Phase II Auth System**: Chatbot must use existing JWT authentication mechanism
- **Database Schema**: Chatbot reads/writes to existing `users.json` and `tasks.json` files

### External Dependencies

- **OpenAI API**: Required for LLM responses (GPT-4 or GPT-3.5-turbo)
- **OpenAI ChatKit React SDK**: For frontend chat integration
- **OpenAI Agents SDK**: For backend agent orchestration
- **Official MCP SDK**: For exposing Todo operations as tools

---

## UI/UX Requirements

### Screens/Components

**1. Chat Interface Components**:

```
┌─────────────────────────────────────┐
│ Todo AI Assistant          [✕]      │ <- Header with close button
├─────────────────────────────────────┤
│                                     │
│ User: Create task to buy groceries  │ <- Message history (scrollable)
│ AI: Task created! Title: "buy       │      - User messages right-aligned
│       groceries", Priority: medium  │      - AI messages left-aligned
│                                     │      - Timestamps on each message
│ User: Show my urgent tasks          │      - Read receipts
│ AI: You have 2 urgent tasks:        │
│       1. Finish report (high)       │
│       2. Call client (high)         │
│                                     │
├─────────────────────────────────────┤
│ [Type your message...]     [Send →] │ <- Input area with send button
└─────────────────────────────────────┘
```

**2. Dashboard Floating Chat Button**:

```
┌─────────────────────────────────────┐
│ Dashboard Tasks              [🔮 AI]│ <- Add AI button to header
├─────────────────────────────────────┤
│ [Task List Content...]              │
│                                     │
│                                      │
│                          [🤖]        │ <- Floating button (bottom-right)
└─────────────────────────────────────┘
```

### User Flow

1. User logs into application → redirected to Dashboard
2. User sees floating 🤖 button in bottom-right corner OR "AI Assistant" button in header
3. User clicks chat button → Chat interface opens (modal or full page)
4. User types natural language command → Message sends to `/api/chat`
5. AI processes using Agent SDK + MCP tools → Streams response back
6. User sees response and can continue conversation or return to dashboard

### Interactions

- **Click chat button**: Opens chat interface (slide-up modal from bottom on mobile, centered modal on desktop)
- **Press Enter in input**: Sends message (Shift+Enter for new line)
- **Press Escape**: Closes chat interface
- **Scroll message history**: Standard touch/mouse scroll
- **Click outside modal**: Closes chat interface (desktop only)
- **Swipe down on mobile**: Closes chat interface

---

## API Requirements

### New Endpoints

```
POST /api/chat
Description: Process user message through AI Agent and return streaming response
Request:
{
  "message": "create a task to buy groceries"
}
Response: Server-Sent Events (SSE) stream
data: {"type": "token", "content": "I'll"}
data: {"type": "token", "content": " create"}
data: {"type": "token", "content": " that"}
data: {"type": "token", "content": " task"}
data: {"type": "tool_call", "tool": "create_task", "params": {"title": "buy groceries", "priority": "medium"}}
data: {"type": "tool_result", "result": {"id": 123, "title": "buy groceries", ...}}
data: {"type": "done", "content": "Task created successfully!"}

Authentication: Required (JWT Bearer token in Authorization header)
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
```

### Modified Endpoints

```
GET /api/tasks
Changes: No functional changes, but Agent SDK will call this endpoint via MCP tools
Breaking: No
Migration: Not applicable

POST /api/tasks
Changes: No functional changes, but Agent SDK will call this endpoint via MCP tools
Breaking: No
Migration: Not applicable

PATCH /api/tasks/{id}
Changes: No functional changes, but Agent SDK will call this endpoint via MCP tools
Breaking: No
Migration: Not applicable

DELETE /api/tasks/{id}
Changes: No functional changes, but Agent SDK will call this endpoint via MCP tools
Breaking: No
Migration: Not applicable
```

---

## Data Model Changes

### New Models

```python
# Agent MCP Tool definitions (backend/agent_tools.py)
from typing import Any, Dict
from pydantic import BaseModel

class MCPTool(BaseModel):
    """Base model for MCP tools"""
    name: str
    description: str
    parameters: Dict[str, Any]

class TodoMCPTools:
    """MCP tools for Todo operations"""

    @staticmethod
    def list_tools() -> list[MCPTool]:
        return [
            MCPTool(
                name="create_task",
                description="Create a new todo task",
                parameters={
                    "title": {"type": "string", "description": "Task title"},
                    "description": {"type": "string", "description": "Task details"},
                    "priority": {"type": "string", "enum": ["high", "medium", "low"], "description": "Task priority"},
                    "category": {"type": "string", "description": "Task category"},
                    "due_date": {"type": "string", "description": "Due date in ISO format"}
                }
            ),
            MCPTool(
                name="read_tasks",
                description="Read all tasks for the authenticated user",
                parameters={
                    "filters": {"type": "object", "description": "Optional filters"}
                }
            ),
            MCPTool(
                name="update_task",
                description="Update an existing task",
                parameters={
                    "task_id": {"type": "integer", "description": "Task ID"},
                    "updates": {"type": "object", "description": "Fields to update"}
                }
            ),
            MCPTool(
                name="delete_task",
                description="Delete a task",
                parameters={
                    "task_id": {"type": "integer", "description": "Task ID"}
                }
            ),
            MCPTool(
                name="toggle_task_complete",
                description="Mark task as complete or incomplete",
                parameters={
                    "task_id": {"type": "integer", "description": "Task ID"},
                    "completed": {"type": "boolean", "description": "Completed status"}
                }
            )
        ]
```

### Modified Models

No modifications to existing models - Chatbot uses existing User and Task models from Phase I/II.

### Database Schema Changes

No schema changes needed. The chatbot reads/writes to the same JSON files (`users.json`, `tasks.json`) used by Phase I/II.

---

## Testing Requirements

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|--------|----------------|
| User creates task via chat | 1. Open chat interface<br>2. Type "create task: call mom tomorrow"<br>3. Send message | Chatbot confirms task creation, task appears in dashboard with title "call mom" and due date tomorrow |
| User views tasks via chat | 1. Open chat interface<br>2. Type "show my tasks"<br>3. Send message | Chatbot lists all user's tasks with IDs, titles, priorities |
| User completes task via chat | 1. Create a test task<br>2. Type "complete task 1"<br>3. Send message<br>4. Check dashboard | Task 1 is marked as completed, shows with green checkmark |
| User asks about overdue tasks | 1. Create an overdue task<br>2. Type "what tasks are overdue"<br>3. Send message | Chatbot lists only overdue tasks with their due dates |
| Unauthenticated chat access | 1. Clear JWT token from localStorage<br>2. Try to send chat message | Request fails with 401, chatbot shows error message |
| Chatbot handles errors | 1. Backend API is down<br>2. Type "show tasks"<br>3. Send message | Chatbot shows user-friendly error: "Sorry, I'm having trouble connecting. Please try again." |
| Mobile responsive chat | 1. Open chat on mobile device (375px width)<br>2. Type message<br>3. Send | Chat interface fits screen, input field visible, message sends successfully |
| Streaming response | 1. Type "tell me a joke"<br>2. Send message | Response appears character-by-character (streaming), not all at once |
| Conversation history persists | 1. Send message "create test task"<br>2. Refresh page<br>3. Open chat again | Previous messages (user and AI) still visible in history |
| Cross-user isolation | 1. User A logs in<br>2. Creates task via chat<br>3. User B logs in<br>4. Asks "show my tasks" | User B does not see User A's task, only their own tasks |

### Edge Cases

- **Ambiguous commands**: "complete the task" → Chatbot asks "Which task would you like to complete?"
- **Empty message**: User sends empty string → Chatbot prompts "Please enter a message"
- **Very long message**: User pastes 1000-character message → Chatbot processes normally (no truncation)
- **Rapid messages**: User sends 5 messages quickly → All processed in order, no messages lost
- **Special characters**: Message includes emojis, Unicode → Displayed correctly in chat
- **Network timeout**: API request takes >10 seconds → Chatbot shows timeout error, allows retry
- **Task not found**: "delete task 999" → Chatbot responds "Task 999 not found. Here are your tasks: [list]"
- **Invalid date**: "create task due: neverday" → Chatbot responds "I couldn't understand that date. Please use a format like 'tomorrow' or '2025-02-20'"

---

## Migration Strategy

### Data Migration

No data migration required. Chatbot uses existing data structures from Phase I/II.

### Backward Compatibility

- **Fully backward compatible**: Phase II dashboard features remain unchanged
- **No breaking changes**: Existing API endpoints work exactly as before
- **Opt-in feature**: Users can choose to use chat or traditional dashboard UI
- **Legacy support**: Old clients (without chat) continue to work

---

## Open Questions

1. **[RESOLVED]** Should the chatbot be a separate page (/chat) or embedded in dashboard?
   - **Decision**: Both options provided - floating button on dashboard + dedicated /chat route for full-page experience

2. **[RESOLVED]** Which OpenAI model to use?
   - **Decision**: GPT-4o-mini for cost efficiency, with option to upgrade to GPT-4o for better reasoning

3. **[RESOLVED]** How to handle conversation history storage?
   - **Decision**: Store in browser localStorage for simplicity (Phase III), can be migrated to database in Phase IV/V

---

## Assumptions

1. **User authentication is working** from Phase II (JWT tokens stored in localStorage)
2. **Backend is running** on http://localhost:8000 (as per Phase I/II setup)
3. **Frontend is running** on http://localhost:3000 (Next.js dev server)
4. **OpenAI API key is available** (user will provide via environment variable)
5. **Existing Todo API endpoints** are functional and tested
6. **ChatKit React SDK** is compatible with Next.js 14 App Router
7. **MCP SDK** provides Python bindings for FastAPI integration
8. **User has basic familiarity** with natural language chat interfaces

---

## Appendix

### References

- **OpenAI ChatKit Documentation**: https://platform.openai.com/docs/chatkit
- **OpenAI Agents SDK**: https://platform.openai.com/docs/agents
- **Model Context Protocol (MCP)**: https://modelcontextprotocol.io
- **Phase I/II Implementation**: Local codebase in `/backend` and `/frontend`
- **Project Constitution**: `.specify/memory/constitution.md`

### Debugging Guide

#### Browser Console Debug Steps (Urdu + English mix):

**Step 1: Console Kholne Ka Tareeqa**
```
1. Browser mein right click karo
2. "Inspect" ya "Inspect Element" par click karo
3. "Console" tab par jao
```

**Step 2: Errors Check Karo**
```javascript
// Console mein ye commands type karo:

// 1. Check if chatbot exists
document.querySelector('button[title*="Chat"]')?.length
// Agar result null hai, to chatbot page par nahi hai

// 2. Check all buttons
document.querySelectorAll('button').forEach((btn, i) => {
  console.log(`Button ${i}:`, btn.textContent);
});

// 3. Check for React errors
// Console mein red error dekho - "TypeError", "ReferenceError" etc.
```

**Step 3: Network Tab Check Karo**
```
1. Inspector mein "Network" tab par jao
2. Page refresh karo
3. Filter: "WS" (WebSocket) ya "XHR" (requests) dekho
4. /api/chat request dikhai de raha hai?
   - Agar haan → backend connect hai
   - Agar nahi → frontend request nahi bhej raha
```

**Step 4: React DevTools Check Karo**
```javascript
// Console mein ye command run karo:
// Check if React is loaded
if (window.$_rarr) {
  // React DevTools hai
  // Components tab mein jao
  // "Dashboard" ya "ChatWidget" component dhundho
  // Props check karo - showChat, user, etc.
}
```

**Step 5: LocalStorage Check Karo**
```javascript
// Console mein ye command run karo:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
// Agar dono null hain → aap login nahi ho
```

#### Common Issues aur Solutions:

| Issue | Console Error | Solution |
|-------|---------------|----------|
| Login nahi ho | `user: null` | http://localhost:3000/login par jao, login karo |
| Chatbot component missing | `Cannot find module './ChatWidget'` | File path check karo, `components/ChatWidget.tsx` exist karta hai |
| API connect nahi ho raha | `ERR_CONNECTION_REFUSED` on `/api/chat` | Backend restart karo: `cd backend && python3 main.py` |
| CORS error | `Access-Control-Allow-Origin` | Backend CORS middleware check karo |
| JWT invalid | `401 Unauthorized` | Token expire ho gaya, logout karke dobara login karo |

---

### Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-02-15 | 1.0 | Initial specification for Phase III AI Chatbot integration |
