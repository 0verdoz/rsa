import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, StageId, RSAKeys } from '../types';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: StageId;
  keys: RSAKeys | null;
}

const PRESET_QUESTIONS = [
  "Why is multiplying two primes easy, but factoring n back so hard?",
  "What is Euler's Totient φ(n) and why is it critical for RSA?",
  "How does clock arithmetic (modular math) keep the message secret?",
  "Why can't Paulson just calculate private exponent d directly from e and n?",
];

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  currentStage,
  keys,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'tutor',
      text: "Greetings, young cryptographer! I am Professor Cyber. Ask me anything about prime numbers, modular clocks, key generation, or Paulson's attacks!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const query = questionText || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/crypto-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: {
            currentStage,
            keys,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to communicate with tutor');

      const tutorMsg: ChatMessage = {
        sender: 'tutor',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: `Professor Cyber Note: ${err.message || 'I had a hiccup connecting to the lab database. Please try asking again!'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
      <div id="ai-tutor-modal" className="bg-white border border-slate-300 w-full max-w-lg h-[92vh] max-h-[800px] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b-4 border-amber-400 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                <span>Professor Cyber</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-300">RSA & Modular Math AI Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'tutor' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                    : 'bg-white border border-slate-300 text-slate-800 rounded-tl-none font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1.5 font-semibold ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-700 text-xs bg-blue-50 border border-blue-200 rounded-xl p-3 w-fit font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Professor Cyber is formulating a mathematical explanation...</span>
            </div>
          )}
        </div>

        {/* Preset Questions Suggestions */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1.5 font-bold">
            Suggested Prompts:
          </span>
          <div className="flex items-center space-x-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about RSA keys, modular clocks, or Paulson's attacks..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
