'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './message-bubble';
import { CHAT_MODES, type ChatMode } from '@/lib/models';
import { motion } from 'framer-motion';
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
    currentMode,
    isLoading,
    setIsLoading,
    setShowAuthModal,
    setSidebarOpen,
    updateCredits,
  } = useAppStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModeConfig = CHAT_MODES.find(m => m.id === currentMode);

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
    <div className="flex flex-col h-screen lg:mr-72">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentModeConfig?.icon}</span>
          <h1 className="font-semibold text-gray-900">{currentModeConfig?.nameFa}</h1>
          {currentModeConfig?.multiAgent && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              چند عاملی
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedModels.length > 0 && (
            <div className="flex -space-x-1">
              {selectedModels.slice(0, 3).map((modelId, idx) => {
                return (
                  <div
                    key={modelId}
                    className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs"
                    style={{ zIndex: 3 - idx }}
                  >
                    {modelId[0].toUpperCase()}
                  </div>
                );
              })}
              {selectedModels.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-900 text-white border-2 border-white flex items-center justify-center text-xs">
                  +{selectedModels.length - 3}
                </div>
              )}
            </div>
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
              className="text-center max-w-md"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                {currentModeConfig?.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {currentModeConfig?.nameFa}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {currentModeConfig?.description}
              </p>
              {currentModeConfig?.multiAgent && (
                <p className="text-sm text-gray-400 mt-4">
                  در این حالت، چند هوش مصنوعی با هم همکاری می‌کنند
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
          </div>
        )}
      </main>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
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
          
          <p className="text-xs text-gray-400 text-center mt-2">
            AI می‌تواند اشتباه کند. اطلاعات مهم را بررسی کنید.
          </p>
        </form>
      </div>
    </div>
  );
}
