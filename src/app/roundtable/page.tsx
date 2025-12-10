'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Send, Loader2, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { ROUNDTABLE_PERSONAS, type RoundtablePersona } from '@/lib/models';
import Link from 'next/link';

interface RoundtableMessage {
  id: string;
  role: 'user' | 'persona';
  content: string;
  personaId?: string;
}

export default function RoundtablePage() {
  const { isAuthenticated, setShowAuthModal } = useAppStore();
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [messages, setMessages] = useState<RoundtableMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'chat'>('select');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const togglePersona = (personaId: string) => {
    if (selectedPersonas.includes(personaId)) {
      setSelectedPersonas(selectedPersonas.filter(p => p !== personaId));
    } else if (selectedPersonas.length < 4) {
      setSelectedPersonas([...selectedPersonas, personaId]);
    }
  };

  const startRoundtable = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (selectedPersonas.length < 2) {
      alert('حداقل ۲ شخصیت انتخاب کنید');
      return;
    }
    setStep('chat');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: RoundtableMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/roundtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          personas: selectedPersonas,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();

      if (res.ok && data.responses) {
        // Add responses from each persona with delay
        for (let i = 0; i < data.responses.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'persona',
            content: data.responses[i].content,
            personaId: data.responses[i].personaId,
          }]);
        }
      }
    } catch (error) {
      console.error('Roundtable error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersona = (personaId: string): RoundtablePersona | undefined => {
    return ROUNDTABLE_PERSONAS.find(p => p.id === personaId);
  };

  const categories = [...new Set(ROUNDTABLE_PERSONAS.map(p => p.category))];

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                بازگشت
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">میزگرد هوش مصنوعی</h1>
              <p className="text-sm text-gray-500">یک میزگرد با شخصیت‌های معروف بسازید</p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Selected Personas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">
                  اعضای میزگرد ({selectedPersonas.length}/4)
                </span>
              </div>
              {selectedPersonas.length >= 2 && (
                <Button onClick={startRoundtable}>
                  شروع میزگرد
                </Button>
              )}
            </div>
            
            {selectedPersonas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                حداقل ۲ شخصیت انتخاب کنید تا میزگرد آغاز شود
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPersonas.map(personaId => {
                  const persona = getPersona(personaId);
                  return persona ? (
                    <motion.div
                      key={personaId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5"
                    >
                      <span className="text-lg">{persona.avatar}</span>
                      <span className="text-sm font-medium">{persona.nameFa}</span>
                      <button
                        onClick={() => togglePersona(personaId)}
                        className="w-5 h-5 rounded-full bg-gray-300 hover:bg-red-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Personas by Category */}
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">
                {category === 'tech' && '🔧 تکنولوژی'}
                {category === 'business' && '💼 کسب و کار'}
                {category === 'philosophy' && '🧘 فلسفه و روانشناسی'}
                {category === 'design' && '✏️ طراحی'}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {ROUNDTABLE_PERSONAS.filter(p => p.category === category).map(persona => (
                  <motion.button
                    key={persona.id}
                    onClick={() => togglePersona(persona.id)}
                    className={`relative bg-white rounded-xl p-4 border-2 transition-all text-right ${
                      selectedPersonas.includes(persona.id)
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedPersonas.includes(persona.id) && (
                      <div className="absolute top-3 left-3 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {persona.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900">{persona.nameFa}</h4>
                        <p className="text-sm text-gray-600 mb-1">{persona.name}</p>
                        <p className="text-xs text-gray-400 truncate">{persona.thinkingStyle}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // Chat View
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => setStep('select')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-gray-900">میزگرد</h1>
          <div className="flex -space-x-2">
            {selectedPersonas.map((personaId, idx) => {
              const persona = getPersona(personaId);
              return persona ? (
                <div
                  key={personaId}
                  className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm"
                  style={{ zIndex: 4 - idx }}
                  title={persona.nameFa}
                >
                  {persona.avatar}
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="w-10" />
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => {
            const persona = message.personaId ? getPersona(message.personaId) : null;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 px-4 py-6 ${
                  message.role === 'user' ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                  message.role === 'user' ? 'bg-gray-900' : 'bg-white border border-gray-200'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-white text-sm">👤</span>
                  ) : (
                    <span>{persona?.avatar || '🤖'}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {message.role === 'user' ? 'شما' : persona?.nameFa || 'AI'}
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 px-4 py-6 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">در حال فکر کردن...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال خود را از میزگرد بپرسید..."
              className="flex-1 resize-none bg-transparent px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none max-h-[200px]"
              rows={1}
              dir="rtl"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
