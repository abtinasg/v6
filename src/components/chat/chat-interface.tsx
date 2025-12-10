'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, ChevronDown, Check, Wifi, WifiOff, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './message-bubble';
import { CHAT_MODES, AI_MODELS, type ChatMode } from '@/lib/models';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '@/types';
import { formatCredits } from '@/lib/utils';

// Helper function to check if authentication is required
function requiresAuthentication(
  currentMode: ChatMode,
  messagesLength: number,
  isAuthenticated: boolean
): boolean {
  if (isAuthenticated) return false;
  // AI modes always require authentication
  if (currentMode !== 'chat') return true;
  // First message in chat mode requires authentication
  return messagesLength === 0;
}

export function ChatInterface() {
  const {
    user,
    isAuthenticated,
    messages,
    addMessage,
    selectedModels,
    setSelectedModels,
    currentMode,
    setCurrentMode,
    isLoading,
    setIsLoading,
    setShowAuthModal,
    setSidebarOpen,
    updateCredits,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const currentModeConfig = CHAT_MODES.find(m => m.id === currentMode);
  const selectedModel = AI_MODELS.find(m => m.id === selectedModels[0]);

  // Check online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (modelId: string) => {
    // For multi-agent modes, allow selecting multiple models
    if (currentModeConfig?.multiAgent) {
      if (selectedModels.includes(modelId)) {
        // Don't allow deselecting the last model
        if (selectedModels.length > 1) {
          setSelectedModels(selectedModels.filter(m => m !== modelId));
        }
      } else {
        setSelectedModels([...selectedModels, modelId]);
      }
    } else {
      // For single-agent modes, select only one model
      setSelectedModels([modelId]);
      setShowModelDropdown(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    // Check if authentication is required before proceeding
    if (requiresAuthentication(currentMode, messages.length, isAuthenticated)) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      chatId: '',
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          models: selectedModels,
          mode: currentMode,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Add AI responses
        for (const response of data.responses) {
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            chatId: '',
            role: 'assistant',
            content: response.content,
            model: response.model,
            createdAt: new Date(),
          };
          addMessage(aiMessage);
        }

        // Update credits
        if (data.creditsUsed && user) {
          updateCredits(user.credits - data.creditsUsed);
        }
      } else {
        if (data.error === 'insufficient_credits') {
          // Handle insufficient credits
          addMessage({
            id: crypto.randomUUID(),
            chatId: '',
            role: 'assistant',
            content: 'اعتبار شما کافی نیست. لطفاً اعتبار خود را شارژ کنید.',
            createdAt: new Date(),
          });
        }
      }
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        chatId: '',
        role: 'assistant',
        content: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        createdAt: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen lg:mr-72 bg-background premium-bg">
      {/* Header - Premium Minimal with Model Selector + Connection Status */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-border-subtle/40 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-3 rounded-2xl hover:bg-surface-hover transition-all duration-200"
        >
          <Menu className="w-5.5 h-5.5 text-muted" />
        </button>
        
        {/* AI Model Selector - Premium Minimal */}
        <div className="relative flex-1 flex justify-center" ref={modelDropdownRef}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-2xl hover:bg-surface-hover/80 transition-all duration-200 group"
          >
            <span className="text-xl">{selectedModel?.avatar || '✦'}</span>
            <span className="font-semibold text-foreground text-sm tracking-tight">
              {selectedModels.length > 1 
                ? `${selectedModels.length} مدل`
                : selectedModel?.name || 'انتخاب مدل'}
            </span>
            <ChevronDown className={`w-4.5 h-4.5 text-muted transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full mt-3 w-72 bg-surface-elevated rounded-3xl shadow-soft border border-border-subtle/60 overflow-hidden z-50"
              >
                <div className="p-2">
                  <p className="text-xs font-semibold text-muted px-4 py-3">
                    {currentModeConfig?.multiAgent 
                      ? 'انتخاب مدل‌ها'
                      : 'مدل هوش مصنوعی'}
                  </p>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-150 ${
                        selectedModels.includes(model.id)
                          ? 'bg-accent-subtle text-accent'
                          : 'hover:bg-surface-hover text-foreground'
                      }`}
                    >
                      <span className="text-lg">{model.avatar}</span>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className={`text-xs mt-0.5 ${selectedModels.includes(model.id) ? 'text-accent/70' : 'text-muted-foreground'}`}>
                          {model.creditCost} اعتبار
                        </p>
                      </div>
                      {selectedModels.includes(model.id) && (
                        <Check className="w-4.5 h-4.5 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connection Status + Credits */}
        <div className="flex items-center gap-3">
          {/* User Credits Display */}
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-hover/50 border border-border-subtle/30">
              <span className="text-accent text-sm">💎</span>
              <span className="text-sm font-semibold text-foreground">{formatCredits(user.credits)}</span>
            </div>
          )}
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium ${
            isOnline ? 'text-accent bg-accent-subtle' : 'text-red-400 bg-red-500/10'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">آنلاین</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">آفلاین</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-8">
            {/* Welcome Card - Premium */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-center max-w-md"
            >
              {/* HUNO Icon - Enhanced with depth and glow */}
              <div className="w-24 h-24 bg-gradient-to-b from-surface-elevated to-surface rounded-hero flex items-center justify-center mx-auto mb-8 shadow-soft animate-glow-pulse relative">
                <div className="absolute inset-0 rounded-hero bg-gradient-to-b from-white/[0.03] to-transparent" />
                <Sparkles className="w-10 h-10 text-accent/90" />
              </div>
              
              {/* HUNO Name - Weighted, clear with optimal spacing */}
              <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight text-premium">
                HUNO
              </h1>
              
              {/* Tagline - Lighter, higher line-height for premium feel */}
              <p className="text-foreground-secondary text-lg leading-loose mb-10">
                دستیار هوش مصنوعی شما
              </p>
              <p className="text-muted text-sm leading-relaxed">
                آماده پاسخ‌گویی به سوالات شما هستم
              </p>

              {/* Mode indicator - Premium pill */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-elevated/80 rounded-2xl text-sm text-muted mt-10 border border-border-subtle/30">
                <span className="text-lg">{currentModeConfig?.icon}</span>
                <span className="font-medium">حالت {currentModeConfig?.nameFa}</span>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                model={message.model}
                persona={message.persona}
              />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-5 px-5 py-6"
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-elevated flex items-center justify-center shadow-soft-sm">
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-accent" />
                </div>
                <div className="flex-1 flex items-center pt-1.5">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted/60 rounded-full animate-pulse-delay-0" />
                    <span className="w-2 h-2 bg-muted/60 rounded-full animate-pulse-delay-150" />
                    <span className="w-2 h-2 bg-muted/60 rounded-full animate-pulse-delay-300" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area with Mode Selector - Premium */}
      <div className="border-t border-border-subtle/30 bg-background/80 backdrop-blur-xl px-5 py-5">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Chat Mode Selector - Modern Premium Pills */}
          <div className="flex items-center justify-center gap-3 mb-5 overflow-x-auto pb-1">
            {CHAT_MODES.filter(mode => mode.id !== 'roundtable').map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setCurrentMode(mode.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentMode === mode.id
                    ? 'bg-surface-active text-foreground shadow-soft-sm'
                    : 'text-muted hover:text-foreground hover:bg-surface-hover/60'
                }`}
              >
                <span className="text-lg">{mode.icon}</span>
                <span>{mode.nameFa}</span>
              </button>
            ))}
          </div>
          
          {/* Input Area - Premium Modern Chat */}
          <div className="relative flex items-end gap-4 bg-surface-elevated rounded-3xl p-4 shadow-input border border-border-subtle/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px] text-[15px] leading-relaxed"
              rows={1}
              dir="rtl"
            />
            
            {/* Floating Send Button - Premium */}
            <Button
              type="submit"
              size="lg"
              disabled={!input.trim() || isLoading}
              className="rounded-2xl w-12 h-12 p-0 flex items-center justify-center shadow-glow-subtle"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            HUNO می‌تواند اشتباه کند. اطلاعات مهم را بررسی کنید.
          </p>
        </form>
      </div>
    </div>
  );
}
