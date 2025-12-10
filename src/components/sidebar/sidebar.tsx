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
    <div className="h-full flex flex-col bg-surface-elevated">
      {/* Header - Premium with subtle depth */}
      <div className="p-6 border-b border-border-subtle/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-background rounded-2xl flex items-center justify-center shadow-soft-sm">
              <span className="text-xl">✦</span>
            </div>
            <div>
              <span className="text-lg font-bold text-foreground block tracking-tight">HUNO</span>
              <span className="text-xs text-muted-foreground">دستیار هوش مصنوعی</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-3 rounded-2xl hover:bg-surface-hover transition-all duration-200"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-5">
        <Button
          onClick={handleNewChat}
          className="w-full justify-center gap-2.5 py-3.5"
          variant="primary"
        >
          <Plus className="w-4.5 h-4.5" />
          گفتگوی جدید
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted">تاریخچه</p>
        </div>
        <div className="space-y-1.5">
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft-sm">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted font-medium">گفتگویی وجود ندارد</p>
              <p className="text-xs text-muted-foreground mt-1.5">شروع به نوشتن کنید</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 text-sm transition-all duration-150 ${
                  currentChatId === chat.id
                    ? 'bg-surface-active shadow-soft-sm'
                    : 'hover:bg-surface-hover'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentChatId === chat.id ? 'bg-accent-subtle text-accent' : 'bg-background text-muted-foreground'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="flex-1 text-right truncate text-foreground font-medium">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section - Premium with subtle divider */}
      <div className="p-5 border-t border-border-subtle/30 space-y-1.5">
        {/* Credits - Premium Card */}
        {isAuthenticated && user && (
          <Link href="/credits">
            <div className="p-5 bg-background rounded-2xl mb-4 shadow-soft-sm border border-border-subtle/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1.5">اعتبار شما</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{formatCredits(user.credits)}</span>
                    <span className="text-accent text-lg">💎</span>
                  </div>
                </div>
                <div className="w-11 h-11 bg-surface-elevated rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-muted" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Nav Links */}
        <Link href="/roundtable" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3.5 py-3">
            <Users className="w-4.5 h-4.5 text-muted" />
            <span className="text-sm font-medium">میزگرد</span>
          </Button>
        </Link>
        
        <Link href="/credits" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3.5 py-3">
            <CreditCard className="w-4.5 h-4.5 text-muted" />
            <span className="text-sm font-medium">خرید اعتبار</span>
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start gap-3.5 py-3">
          <Settings className="w-4.5 h-4.5 text-muted" />
          <span className="text-sm font-medium">تنظیمات</span>
        </Button>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3.5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={logout}
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="text-sm font-medium">خروج</span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full py-3 mt-3"
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
      {/* Desktop Sidebar - Premium with subtle shadow */}
      <aside className="hidden lg:flex w-72 h-screen fixed right-0 top-0 border-l border-border-subtle/30 shadow-sidebar">
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
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="lg:hidden fixed right-0 top-0 w-80 h-screen z-50 shadow-soft"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
