'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, ChevronDown, Check } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const currentModeConfig = CHAT_MODES.find(m => m.id === currentMode);
  const selectedModel = AI_MODELS.find(m => m.id === selectedModels[0]);

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
    <div className="flex flex-col h-screen lg:mr-72 bg-gradient-to-b from-gray-50 to-white">
      {/* Header with AI Model Selector */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* AI Model Selector - ChatGPT Style */}
        <div className="relative flex-1 flex justify-center" ref={modelDropdownRef}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
          >
            <span className="text-xl">{selectedModel?.avatar || '🤖'}</span>
            <span className="font-semibold text-gray-800">
              {selectedModels.length > 1 
                ? `${selectedModels.length} مدل انتخاب شده`
                : selectedModel?.name || 'انتخاب مدل'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 px-3 py-2">
                    {currentModeConfig?.multiAgent 
                      ? 'انتخاب مدل‌ها (چند انتخابی)'
                      : 'انتخاب مدل هوش مصنوعی'}
                  </p>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        selectedModels.includes(model.id)
                          ? 'bg-gray-900 text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{model.avatar}</span>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className={`text-xs ${selectedModels.includes(model.id) ? 'text-gray-300' : 'text-gray-500'}`}>
                          {model.creditCost} اعتبار
                        </p>
                      </div>
                      {selectedModels.includes(model.id) && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {currentModeConfig?.multiAgent && (
            <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
              چند عاملی
            </span>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-lg"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-inner">
                {currentModeConfig?.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {currentModeConfig?.nameFa}
              </h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                {currentModeConfig?.description}
              </p>
              {currentModeConfig?.multiAgent && (
                <p className="text-sm text-gray-400 mt-6 bg-gray-50 px-4 py-2 rounded-xl inline-block">
                  ✨ در این حالت، چند هوش مصنوعی با هم همکاری می‌کنند
                </p>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
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
                className="flex gap-3 px-4 py-6 bg-gradient-to-r from-gray-50 to-white"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-gray-500">در حال پردازش...</p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input with Mode Selector */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Chat Mode Selector Pills */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {CHAT_MODES.filter(mode => mode.id !== 'roundtable').map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setCurrentMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentMode === mode.id
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.nameFa}</span>
              </button>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="relative flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-gray-400 focus-within:shadow-lg focus-within:shadow-gray-200/50 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 resize-none bg-transparent px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none max-h-[200px] text-base"
              rows={1}
              dir="rtl"
            />
            <Button
              type="submit"
              size="md"
              disabled={!input.trim() || isLoading}
              className="rounded-xl shadow-lg shadow-gray-900/25 hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            🤖 AI می‌تواند اشتباه کند. اطلاعات مهم را بررسی کنید.
          </p>
        </form>
      </div>
    </div>
  );
}
