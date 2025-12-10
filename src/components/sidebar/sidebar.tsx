'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MessageSquare, Settings, CreditCard, Users, LogOut, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { AI_MODELS, CHAT_MODES } from '@/lib/models';
import { formatCredits } from '@/lib/utils';
import Link from 'next/link';

export function Sidebar() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    user, 
    isAuthenticated,
    chats, 
    currentChatId,
    setCurrentChat,
    selectedModels,
    setSelectedModels,
    currentMode,
    setCurrentMode,
    setShowAuthModal,
    logout
  } = useAppStore();

  const handleNewChat = () => {
    setCurrentChat(null);
    setSidebarOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChat(chatId);
    setSidebarOpen(false);
  };

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== modelId));
      }
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-900" />
            <span className="text-lg font-bold text-gray-900">AI Studio</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
          variant="secondary"
        >
          <Plus className="w-4 h-4" />
          گفتگوی جدید
        </Button>
      </div>

      {/* Chat Modes */}
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-gray-400 mb-2 px-2">حالت‌ها</p>
        <div className="grid grid-cols-2 gap-1.5">
          {CHAT_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                currentMode === mode.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.nameFa}
            </button>
          ))}
        </div>
      </div>

      {/* Active Models */}
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-gray-400 mb-2 px-2">مدل‌های فعال</p>
        <div className="space-y-1">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`w-full p-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                selectedModels.includes(model.id)
                  ? 'bg-white shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>{model.avatar}</span>
              <span className="flex-1 text-right">{model.name}</span>
              {selectedModels.includes(model.id) && (
                <span className="text-xs text-gray-400">{model.creditCost} 💎</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="text-xs font-medium text-gray-400 mb-2 px-2">تاریخچه گفتگو</p>
        <div className="space-y-1">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">گفتگویی وجود ندارد</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-sm transition-all ${
                  currentChatId === chat.id
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-right truncate">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-100 space-y-2">
        {/* Credits */}
        {isAuthenticated && user && (
          <Link href="/credits">
            <div className="p-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white mb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">اعتبار شما</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{formatCredits(user.credits)}</span>
                  <span>💎</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Nav Links */}
        <Link href="/roundtable" className="w-full">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="w-4 h-4" />
            میزگرد هوش مصنوعی
          </Button>
        </Link>
        
        <Link href="/credits" className="w-full">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <CreditCard className="w-4 h-4" />
            خرید اعتبار
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="w-4 h-4" />
          تنظیمات
        </Button>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => setShowAuthModal(true)}
          >
            ورود / ثبت‌نام
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 border-r border-gray-100">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 w-80 h-screen z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
