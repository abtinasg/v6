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
  const roundtableTitle = 'میزگرد';

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-background text-foreground lg:mr-72">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background-elevated/80 backdrop-blur border-b border-border-subtle px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3 justify-between">
            <Link href="/" className="flex-shrink-0">
              <Button variant="secondary" size="sm" className="rounded-xl gap-2">
                <ArrowRight className="w-4 h-4 ml-1" />
                بازگشت
              </Button>
            </Link>

            <div className="flex-1 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-dark/70 mb-1">{roundtableTitle}</p>
              <h1 className="text-xl sm:text-2xl font-extrabold">میزگرد هوش مصنوعی</h1>
              <p className="text-sm text-muted">یک میزگرد با شخصیت‌های معروف بسازید و نظرات متفاوت بگیرید</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-xl bg-surface-hover border border-border-subtle text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-muted" />
                <span>{selectedPersonas.length}/4</span>
              </div>
              {selectedPersonas.length >= 2 && (
                <Button onClick={startRoundtable} size="sm" className="rounded-xl shadow-glow">
                  شروع میزگرد
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-surface via-background-elevated to-surface-elevated shadow-depth p-6 sm:p-8"
          >
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-accent/10 blur-3xl rounded-full" />
            <div className="absolute left-1/2 -top-10 w-40 h-40 bg-accent-soft/10 blur-3xl rounded-full" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border-subtle shadow-soft flex items-center justify-center text-3xl">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1 space-y-3 text-right">
                <p className="text-sm text-muted-dark">شخصیت‌های مختلف را انتخاب کنید و از دیدگاه آن‌ها بشنوید</p>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">حداقل ۲ شخصیت</span>
                  <span className="px-3 py-1 rounded-full bg-surface-hover text-xs font-semibold text-muted">حداکثر ۴ شخصیت</span>
                  <span className="px-3 py-1 rounded-full bg-surface-hover text-xs font-semibold text-muted">پوشش حوزه‌های مختلف</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selected Personas */}
          <div className="bg-surface-elevated rounded-3xl p-6 border border-border-subtle shadow-depth">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-surface-hover flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted-dark/80 font-semibold">اعضای میزگرد</p>
                  <p className="text-xs text-muted">شخصیت‌های انتخاب‌شده در اینجا نمایش داده می‌شوند</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-dark bg-surface-hover px-3 py-1.5 rounded-xl border border-border-subtle">
                  {selectedPersonas.length === 0 ? 'منتظر انتخاب شما' : 'برای حذف روی هر کدام کلیک کنید'}
                </span>
              </div>
            </div>

            {selectedPersonas.length === 0 ? (
              <div className="text-center py-6 text-muted">
                حداقل ۲ شخصیت انتخاب کنید تا میزگرد آغاز شود
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPersonas.map(personaId => {
                  const persona = getPersona(personaId);
                  return persona ? (
                    <motion.button
                      key={personaId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => togglePersona(personaId)}
                      className="flex items-center gap-2 bg-surface-hover border border-border-subtle rounded-full px-3 py-1.5 text-sm hover:border-accent/40 transition-all"
                    >
                      <span className="text-lg">{persona.avatar}</span>
                      <span className="font-semibold">{persona.nameFa}</span>
                      <span className="text-[10px] text-muted-dark bg-background/70 px-2 py-0.5 rounded-full">
                        {persona.category === 'tech' && 'تکنولوژی'}
                        {persona.category === 'business' && 'کسب‌وکار'}
                        {persona.category === 'philosophy' && 'فلسفه'}
                        {persona.category === 'design' && 'طراحی'}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-border-subtle flex items-center justify-center text-muted text-xs hover:text-red-300 hover:bg-red-500/20 transition-colors">
                        ×
                      </span>
                    </motion.button>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Personas by Category */}
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted flex items-center gap-2 px-1">
                {category === 'tech' && '🔧 تکنولوژی'}
                {category === 'business' && '💼 کسب و کار'}
                {category === 'philosophy' && '🧘 فلسفه و روانشناسی'}
                {category === 'design' && '✏️ طراحی'}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {ROUNDTABLE_PERSONAS.filter(p => p.category === category).map(persona => {
                  const selected = selectedPersonas.includes(persona.id);
                  return (
                    <motion.button
                      key={persona.id}
                      onClick={() => togglePersona(persona.id)}
                      className={`relative text-right rounded-2xl p-4 border transition-all bg-surface hover:-translate-y-0.5 ${
                        selected
                          ? 'border-accent/60 shadow-glow-soft'
                          : 'border-border-subtle hover:border-accent/30'
                      }`}
                      whileTap={{ scale: 0.99 }}
                    >
                      {selected && (
                        <div className="absolute top-3 left-3 w-6 h-6 bg-accent text-background rounded-full flex items-center justify-center shadow-glow-soft">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-2xl flex-shrink-0">
                          {persona.avatar}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-foreground">{persona.nameFa}</h4>
                            <span className="text-[11px] text-muted-dark bg-surface-hover px-2 py-1 rounded-lg">
                              {persona.name || persona.nameFa}
                            </span>
                          </div>
                          <p className="text-xs text-muted truncate">{persona.description}</p>
                          <p className="text-[11px] text-muted-dark/80 truncate">{persona.thinkingStyle}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // Chat View
  return (
    <div className="flex flex-col h-screen bg-background text-foreground lg:mr-72">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border-subtle bg-background-elevated/80 backdrop-blur sticky top-0 z-10">
        <button
          onClick={() => setStep('select')}
          className="p-2 rounded-xl hover:bg-surface-hover border border-border-subtle transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-muted" />
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="font-semibold">میزگرد</h1>
          <div className="flex -space-x-2">
            {selectedPersonas.map((personaId, idx) => {
              const persona = getPersona(personaId);
              return persona ? (
                <div
                  key={personaId}
                  className="w-8 h-8 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-sm shadow-soft"
                  style={{ zIndex: 6 - idx }}
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
      <main className="flex-1 overflow-y-auto bg-background">
        <AnimatePresence>
          {messages.map((message) => {
            const persona = message.personaId ? getPersona(message.personaId) : null;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 px-4 py-6 border-b border-border-subtle/60 ${
                  message.role === 'user' ? 'bg-background' : 'bg-surface'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg ${
                  message.role === 'user' ? 'bg-accent/10 text-accent' : 'bg-surface-elevated border border-border-subtle'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-sm">👤</span>
                  ) : (
                    <span>{persona?.avatar || '🤖'}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-dark/80 mb-2">
                    {message.role === 'user' ? 'شما' : persona?.nameFa || 'AI'}
                  </p>
                  <p className="text-foreground whitespace-pre-wrap leading-loose">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 px-4 py-6 bg-surface border-b border-border-subtle/60">
            <div className="w-10 h-10 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted">در حال فکر کردن...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="border-t border-border-subtle bg-background-elevated/70 backdrop-blur px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3 bg-surface-elevated/90 rounded-2xl p-3 border border-border-subtle shadow-soft">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال خود را از میزگرد بپرسید..."
              className="flex-1 resize-none bg-transparent px-3 py-2 text-foreground placeholder:text-muted-dark/70 focus:outline-none max-h-[200px]"
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
