import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { getChatModeLabel, sendChatMessage, type ChatMessage } from '../services/chatService'

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi, I'm AgriSense AI. Ask me about crop prices, or how location and logistics affect what you'd net on a sale.",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(nextMessages.filter((m) => m !== GREETING))
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch {
      setError('Unable to reach the AI assistant. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AgriSense AI chat' : 'Open AgriSense AI chat'}
        className="focus-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-agricon text-white shadow-lg transition-transform hover:scale-105 hover:bg-agricon-deep"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-[76px] right-5 z-50 flex h-[70vh] max-h-[520px] w-[92vw] max-w-[360px] flex-col overflow-hidden rounded-lg border border-line bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-line bg-agricon-faint px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-agricon-deep" />
              <div>
                <div className="text-[13.5px] font-semibold text-ink">AgriSense AI</div>
                <div className="text-[11px] text-muted">{getChatModeLabel()}</div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-md px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-agricon text-white'
                      : 'bg-agricon-faint text-ink'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-md bg-agricon-faint px-3 py-2 text-[13px] text-muted">
                  Thinking…
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
                {error}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a crop price…"
              className="focus-ring flex-1 rounded-md border border-line bg-white px-3 py-2 text-[13px] text-ink"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-md bg-agricon text-white disabled:opacity-50"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
