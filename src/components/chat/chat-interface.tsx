'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, ChevronDown, Check, Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './message-bubble';
import { CHAT_MODES, AI_MODELS, type ChatMode } from '@/lib/models';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '@/types';

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
    <div className="flex flex-col h-screen lg:mr-72 bg-background">
      {/* Header - Minimal with Model Selector + Connection Status */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background sticky top-0 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-full hover:bg-surface transition-colors"
        >
          <Menu className="w-5 h-5 text-muted" />
        </button>
        
        {/* AI Model Selector - Minimal */}
        <div className="relative flex-1 flex justify-center" ref={modelDropdownRef}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface transition-colors group"
          >
            <span className="text-lg">{selectedModel?.avatar || '✦'}</span>
            <span className="font-medium text-foreground text-sm">
              {selectedModels.length > 1 
                ? `${selectedModels.length} مدل`
                : selectedModel?.name || 'انتخاب مدل'}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full mt-2 w-64 bg-surface rounded-2xl shadow-soft border border-border overflow-hidden z-50"
              >
                <div className="p-1.5">
                  <p className="text-xs font-medium text-muted px-3 py-2">
                    {currentModeConfig?.multiAgent 
                      ? 'انتخاب مدل‌ها'
                      : 'مدل هوش مصنوعی'}
                  </p>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                        selectedModels.includes(model.id)
                          ? 'bg-accent/10 text-accent'
                          : 'hover:bg-surface-hover text-foreground'
                      }`}
                    >
                      <span className="text-base">{model.avatar}</span>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className={`text-xs ${selectedModels.includes(model.id) ? 'text-accent/70' : 'text-muted'}`}>
                          {model.creditCost} اعتبار
                        </p>
                      </div>
                      {selectedModels.includes(model.id) && (
                        <Check className="w-4 h-4 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
            isOnline ? 'text-accent' : 'text-red-400'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">آنلاین</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">آفلاین</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center max-w-sm"
            >
              {/* HUNO Icon */}
              <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="text-4xl">✦</span>
              </div>
              
              {/* HUNO Name */}
              <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                HUNO
              </h1>
              
              {/* Tagline */}
              <p className="text-muted text-base leading-relaxed mb-8">
                دستیار هوش مصنوعی شما
                <br />
                <span className="text-sm">آماده پاسخ‌گویی به سوالات شما هستم</span>
              </p>

              {/* Mode indicator */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-sm text-muted">
                <span>{currentModeConfig?.icon}</span>
                <span>حالت {currentModeConfig?.nameFa}</span>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-4">
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
                className="flex gap-4 px-4 py-5"
              >
                <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shadow-soft">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                </div>
                <div className="flex-1 flex items-center pt-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse-delay-0" />
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse-delay-150" />
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse-delay-300" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area with Mode Selector */}
      <div className="border-t border-border/50 bg-background px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Chat Mode Selector - Modern Rounded Pills */}
          <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-1">
            {CHAT_MODES.filter(mode => mode.id !== 'roundtable').map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setCurrentMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentMode === mode.id
                    ? 'bg-surface-active text-foreground'
                    : 'text-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                <span className="text-base">{mode.icon}</span>
                <span>{mode.nameFa}</span>
              </button>
            ))}
          </div>
          
          {/* Input Area - Minimal */}
          <div className="relative flex items-end gap-3 bg-surface rounded-2xl p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 resize-none bg-transparent px-2 py-2 text-foreground placeholder:text-muted focus:outline-none max-h-[200px] text-[15px]"
              rows={1}
              dir="rtl"
            />
            
            {/* Floating Send Button - Larger */}
            <Button
              type="submit"
              size="lg"
              disabled={!input.trim() || isLoading}
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted/60 text-center mt-3">
            HUNO می‌تواند اشتباه کند. اطلاعات مهم را بررسی کنید.
          </p>
        </form>
      </div>
    </div>
  );
}
