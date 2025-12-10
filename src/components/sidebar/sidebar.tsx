'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MessageSquare, Settings, CreditCard, Users, LogOut, Sparkles, Clock } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
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

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 block">AI Studio</span>
              <span className="text-xs text-gray-500">نسخه حرفه‌ای</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-center gap-2 shadow-lg shadow-gray-900/25 py-3"
          variant="primary"
        >
          <Plus className="w-5 h-5" />
          گفتگوی جدید
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold text-gray-500">تاریخچه گفتگو</p>
        </div>
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">گفتگویی وجود ندارد</p>
              <p className="text-xs text-gray-400 mt-1">شروع به نوشتن کنید</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-white shadow-md border border-gray-100'
                    : 'hover:bg-white/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentChatId === chat.id ? 'bg-gray-900 text-white' : 'bg-gray-100'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="flex-1 text-right truncate text-gray-700">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {/* Credits */}
        {isAuthenticated && user && (
          <Link href="/credits">
            <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl text-white mb-3 shadow-xl shadow-gray-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-300 block mb-1">اعتبار شما</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{formatCredits(user.credits)}</span>
                    <span className="text-lg">💎</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Nav Links */}
        <Link href="/roundtable" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-3 hover:bg-gray-100">
            <Users className="w-5 h-5 text-gray-500" />
            <span>میزگرد هوش مصنوعی</span>
          </Button>
        </Link>
        
        <Link href="/credits" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-3 hover:bg-gray-100">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span>خرید اعتبار</span>
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start gap-3 py-3 hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-500" />
          <span>تنظیمات</span>
        </Button>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 py-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full py-3 shadow-lg shadow-gray-900/25"
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
      <aside className="hidden lg:flex w-72 h-screen fixed right-0 top-0 border-l border-gray-200 shadow-lg">
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
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 w-80 h-screen z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
