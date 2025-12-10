'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MessageSquare, Settings, CreditCard, Users, LogOut, Clock } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-surface-elevated border-l border-border-subtle shadow-depth">
      {/* Header */}
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-background-elevated to-background rounded-2xl flex items-center justify-center shadow-soft-sm">
              <span className="text-2xl">✦</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-foreground block tracking-tight">HUNO</span>
              <span className="text-xs text-muted-dark">دستیار هوش مصنوعی</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-3 rounded-xl hover:bg-surface-hover transition-all duration-200"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      
      {/* User Credits Display - Prominent */}
      {isAuthenticated && user && (
        <div className="px-6 pt-6 pb-4">
          <Link href="/credits">
            <div className="p-5 bg-gradient-to-br from-background-elevated to-background rounded-2xl border border-border-subtle shadow-soft-sm hover:shadow-soft transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-dark block mb-2 font-medium">اعتبار شما</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-foreground">{formatCredits(user.credits)}</span>
                    <span className="text-2xl">💎</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-surface-elevated rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* New Chat Button */}
      <div className="px-6 pb-5">
        <Button
          onClick={handleNewChat}
          className="w-full justify-center gap-2.5 py-3.5 shadow-glow"
          variant="primary"
        >
          <Plus className="w-5 h-5" />
          گفتگوی جدید
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-dark" />
          <p className="text-xs font-semibold text-muted-dark">تاریخچه</p>
        </div>
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-background-elevated rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft-sm border border-border-subtle">
                <MessageSquare className="w-6 h-6 text-muted" />
              </div>
              <p className="text-sm text-muted font-medium">گفتگویی وجود ندارد</p>
              <p className="text-xs text-muted-dark/60 mt-2">شروع به نوشتن کنید</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 text-sm transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-surface-active shadow-soft-sm'
                    : 'hover:bg-surface-hover'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentChatId === chat.id ? 'bg-accent/10 text-accent' : 'bg-background text-muted'
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="flex-1 text-right truncate text-foreground font-medium">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-border-subtle space-y-2">
        {/* Nav Links */}
        <Link href="/roundtable" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-3 rounded-xl">
            <Users className="w-5 h-5 text-muted" />
            <span className="text-sm font-medium">میزگرد</span>
          </Button>
        </Link>
        
        <Link href="/credits" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-3 rounded-xl">
            <CreditCard className="w-5 h-5 text-muted" />
            <span className="text-sm font-medium">خرید اعتبار</span>
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start gap-3 py-3 rounded-xl">
          <Settings className="w-5 h-5 text-muted" />
          <span className="text-sm font-medium">تنظیمات</span>
        </Button>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">خروج</span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full py-3.5 mt-3 shadow-glow"
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
      <aside className="hidden lg:flex w-72 h-screen fixed right-0 top-0">
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
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 w-80 h-screen z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
