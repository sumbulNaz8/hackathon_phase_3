'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatWidgetProps {
  tasks: any[]
  onCreateTask: (title: string, description: string, priority: string, category: string, dueDate: string) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onToggleTask: (taskId: number) => Promise<void>
  onUpdateTask: (taskId: number, title: string, description: string, priority: string, category: string, dueDate: string) => Promise<any>
  user: any
  onClose?: () => void
}

export default function ChatWidget({ tasks, onCreateTask, onDeleteTask, onToggleTask, onUpdateTask, user, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: '👋 Hello! Main aapki Task Assistant hoon.\n\nAap mujhse normally baat kar sakti ho jaise kisi friend se:\n• "Ek naya task add kro mango ka"\n• "Orange ko grapes se replace kr"\n• "Mera task complete ho gya"\n• "Mere tasks dikhao"\n• "Task delete kr do"\n\nKuch bhi poocho! 😊' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage) return

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const msg = userMessage.toLowerCase()
      let botResponse = ''

      // CREATE TASK - Natural language patterns
      if (msg.includes('add') && (msg.includes('task') || msg.includes('ka') || msg.includes('ki')) ||
          msg.includes('create') || msg.includes('naya') || msg.includes('new') ||
          msg.includes('banao') || msg.includes('add kr')) {

        // Extract task name - remove common words
        let taskTitle = userMessage
          .replace(/add|create|naya|new|task|task|banao|add kr|kro|gi|ka|ki|ko|se|mein|par|please/gi, ' ')
          .replace(/\s+/g, ' ').trim()

        if (!taskTitle || taskTitle.length < 2) {
          taskTitle = 'New Task'
        }

        const priority = msg.includes('urgent') || msg.includes('jaldi') || msg.includes('important') ? 'high' :
                        msg.includes('low') || msg.includes('non-urgent') ? 'low' : 'medium'

        const category = msg.includes('work') ? 'Work' :
                        msg.includes('personal') ? 'Personal' :
                        msg.includes('shopping') || msg.includes('market') ? 'Shopping' : 'General'

        onCreateTask(taskTitle, '', priority, category, '').then(() => {
          botResponse = `✅ Task banaya gaya!\n\n📝 **${taskTitle}**\n🎯 Priority: ${priority}\n📁 Category: ${category}\n\nAur kya kaam karna hai?`
          setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
          setIsLoading(false)
        })
        return
      }

      // UPDATE TASK - "orange ko grapes se replace kr" / "change orange to grapes"
      else if (msg.includes('update') || msg.includes('change') || msg.includes('replace') ||
               msg.includes('edit') || msg.includes('modify') || msg.includes('convert') ||
               (msg.includes('ko') && msg.includes('se')) || (msg.includes('to') && msg.includes('change'))) {

        let oldTask = ''
        let newTask = ''

        // Pattern: "orange ko grapes se replace kr" or "update orange to grapes"
        const koSePattern = msg.match(/(.+?)\s+ko\s+(.+?)\s+se\s+(?:replace|convert|change|update|banaye|kro|kr)/)
        const toPattern = msg.match(/(?:update|change|replace|convert)\s+(.+?)\s+(?:to|ko|mein)\s+(.+)/)

        if (koSePattern) {
          oldTask = koSePattern[1].trim()
          newTask = koSePattern[2].trim()
        } else if (toPattern) {
          oldTask = toPattern[1].trim()
          newTask = toPattern[2].trim()
        } else {
          // Try simple extraction
          const words = msg.split(/\s+/)
          const koIndex = words.indexOf('ko')
          const seIndex = words.indexOf('se')
          const toIndex = words.indexOf('to')

          if (koIndex > -1 && seIndex > koIndex) {
            oldTask = words.slice(koIndex + 1, seIndex).join(' ')
            newTask = words.slice(seIndex + 1).join(' ').replace(/replace|change|update|kr|kro|convert/gi, '').trim()
          } else if (toIndex > -1) {
            const updateIndex = Math.max(words.indexOf('update'), words.indexOf('change'), words.indexOf('replace'))
            if (updateIndex > -1 && toIndex > updateIndex) {
              oldTask = words.slice(updateIndex + 1, toIndex).join(' ')
              newTask = words.slice(toIndex + 1).join(' ')
            }
          }
        }

        // Clean the task names
        oldTask = oldTask.replace(/task|ka|ki|ko|se|to|please|kr|kro/gi, '').trim()
        newTask = newTask.replace(/task|ka|ki|ko|se|to|please|kr|kro/gi, '').trim()

        const taskToUpdate = tasks.find((t: any) =>
          t.title.toLowerCase().includes(oldTask.toLowerCase()) ||
          t.title.toLowerCase() === oldTask.toLowerCase() ||
          t.id.toString() === oldTask
        )

        if (taskToUpdate && newTask && newTask.length > 0) {
          onUpdateTask(taskToUpdate.id, newTask, taskToUpdate.description || '', taskToUpdate.priority || 'medium', taskToUpdate.category || '', taskToUpdate.due_date || '').then(() => {
            botResponse = `✅ Task update ho gaya!\n\n📝 Pehle: **${taskToUpdate.title}**\n📝 Ab: **${newTask}**\n\nAur kya kaam karna hai?`
            setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
            setIsLoading(false)
          })
          return
        } else {
          botResponse = `❌ Task nahi mila ya naya naam nahi diya.\n\nFormat: "orange ko grapes se replace kr"\n\nAapke tasks:\n` + tasks.map((t: any) => `• ${t.title}`).join('\n')
        }
      }

      // COMPLETE TASK
      else if (msg.includes('complete') || msg.includes('done') || msg.includes('finish') ||
               msg.includes('ho gya') || msg.includes('khatam') || msg.includes('mark') ||
               msg.includes('tick') || msg.includes('hogaya')) {

        let taskName = msg
          .replace(/complete|done|finish|mark|task|ho gya|khatam|tick|hogaya|please|kr|kro/gi, '')
          .trim()

        const taskToComplete = tasks.find((t: any) =>
          !t.completed &&
          (t.title.toLowerCase().includes(taskName.toLowerCase()) ||
           t.title.toLowerCase() === taskName.toLowerCase() ||
           t.id.toString() === taskName)
        )

        if (taskToComplete) {
          onToggleTask(taskToComplete.id).then(() => {
            botResponse = `✅ Task complete ho gaya!\n\n📝 **${taskToComplete.title}**\n\nBahut acha! Aur kya kaam karna hai?`
            setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
            setIsLoading(false)
          })
          return
        } else {
          botResponse = `❌ Task nahi mila.\n\nAapke pending tasks:\n` +
            tasks.filter((t: any) => !t.completed).map((t: any) => `• ${t.title}`).join('\n')
        }
      }

      // DELETE TASK
      else if (msg.includes('delete') || msg.includes('remove') || msg.includes('hataya') ||
               msg.includes('khatam kr') || msg.includes('cancel kr')) {

        let taskName = msg
          .replace(/delete|remove|task|todo|hataya|khatam|cancel|please|kr|kro/gi, '')
          .trim()

        const taskToDelete = tasks.find((t: any) =>
          t.title.toLowerCase().includes(taskName.toLowerCase()) ||
          t.title.toLowerCase() === taskName.toLowerCase() ||
          t.id.toString() === taskName
        )

        if (taskToDelete) {
          onDeleteTask(taskToDelete.id).then(() => {
            botResponse = `🗑️ Task delete ho gaya!\n\n📝 **${taskToDelete.title}**\n\nAur kya kaam karna hai?`
            setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
            setIsLoading(false)
          })
          return
        } else {
          botResponse = `❌ Task nahi mila.\n\nAapke tasks:\n` +
            tasks.map((t: any) => `• ${t.title}`).join('\n')
        }
      }

      // SHOW TASKS
      else if (msg.includes('show') || msg.includes('list') || msg.includes('my task') ||
               msg.includes('mere task') || msg.includes('kya task') || msg.includes('sab task') ||
               msg.includes('tasks dikhao') || msg.includes('kya kaam')) {

        if (tasks.length === 0) {
          botResponse = `📋 Abhi koi task nahi hai.\n\nNaya task banane ke liye kaho: "Ek task add kro mango ka"`
        } else {
          const completed = tasks.filter((t: any) => t.completed).length
          const pending = tasks.length - completed

          let pendingList = tasks.filter((t: any) => !t.completed)
            .map((t: any) => `⏳ ${t.title}`).join('\n') || 'Koi pending task nahi'

          let completedList = tasks.filter((t: any) => t.completed)
            .map((t: any) => `✅ ${t.title}`).join('\n') || 'Koi complete task nahi'

          botResponse = `📋 **Aapke Tasks:**\n\n📊 Total: ${tasks.length}\n✅ Complete: ${completed}\n⏳ Pending: ${pending}\n\n**Pending Tasks:**\n${pendingList}\n\n**Completed Tasks:**\n${completedList}`
        }
      }

      // HELP
      else if (msg.includes('help') || msg.includes('kya kar sakti') || msg.includes('kaise kaam') || msg.includes('guide')) {
        botResponse = `🤖 **Main yeh kaam kar sakti hoon:**\n\n📝 **Naya Task:**\n• "Ek task add kro mango ka"\n• "Mango ka task banao"\n• "Add kr do shopping ka task"\n\n✏️ **Task Update:**\n• "Orange ko grapes se replace kr"\n• "Mango ko banana change kr"\n• "Update task 1 to new name"\n\n🗑️ **Task Delete:**\n• "Mango delete kr do"\n• "Task hatado mango wala"\n\n✅ **Task Complete:**\n• "Mango complete ho gya"\n• "Task mark krdo mango ka"\n\n📋 **Tasks Dekho:**\n• "Mere tasks dikhao"\n• "Kya kaam bacha hai?"\n• "Sab task list kro"\n\nAap normally Hindi/English mix bhi bol sakti ho! 😊`
      }

      // DEFAULT - Unknown command
      else {
        botResponse = `Main samajh gayi: "${userMessage}"\n\nYeh command nahi mila. Try karo:\n• "Tasks dikhao"\n• "Ek naya task add kro"\n• "Orange ko grapes se replace kr"\n• "Task complete mark krdo"\n\n"help" bolo aur full guide milegi! 😊`
      }

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Header */}
      <div className="chat-header" style={{ background: 'var(--gradient-gold-leaf)', borderBottom: '2px solid var(--color-gold-dark)' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'var(--gradient-gold-leaf)',
            border: '3px solid var(--color-deep-brown)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(26, 15, 13, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🤖</span>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            background: 'var(--gradient-gold-leaf)',
            border: '2px solid var(--color-deep-brown)',
            boxShadow: '0 4px 12px rgba(26, 15, 13, 0.2)'
          }}>
            <h3 className="text-2xl font-display font-black" style={{ color: 'var(--color-deep-brown)' }}>AI Assistant</h3>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform" style={{ color: 'var(--color-deep-brown)' }}>✕</button>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role}`}
            >
              <p className="whitespace-pre-wrap font-body">{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Kuch bhi poocho... Hindi/English"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="chat-send-btn"
          >
            ➤
          </button>
        </div>
    </>
  )
}
