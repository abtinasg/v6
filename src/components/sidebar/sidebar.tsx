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
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center">
              <span className="text-xl">✦</span>
            </div>
            <div>
              <span className="text-lg font-bold text-foreground block tracking-tight">HUNO</span>
              <span className="text-xs text-muted">دستیار هوش مصنوعی</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2.5 rounded-full hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-center gap-2 py-3"
          variant="primary"
        >
          <Plus className="w-4 h-4" />
          گفتگوی جدید
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-muted" />
          <p className="text-xs font-medium text-muted">تاریخچه</p>
        </div>
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-muted" />
              </div>
              <p className="text-sm text-muted">گفتگویی وجود ندارد</p>
              <p className="text-xs text-muted/60 mt-1">شروع به نوشتن کنید</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-surface-active'
                    : 'hover:bg-surface-hover'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentChatId === chat.id ? 'bg-accent/10 text-accent' : 'bg-background text-muted'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="flex-1 text-right truncate text-foreground">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/50 space-y-1">
        {/* Credits */}
        {isAuthenticated && user && (
          <Link href="/credits">
            <div className="p-4 bg-background rounded-2xl mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted block mb-1">اعتبار</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-foreground">{formatCredits(user.credits)}</span>
                    <span className="text-accent">💎</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-muted" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Nav Links */}
        <Link href="/roundtable" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-2.5">
            <Users className="w-4 h-4 text-muted" />
            <span className="text-sm">میزگرد</span>
          </Button>
        </Link>
        
        <Link href="/credits" className="w-full block">
          <Button variant="ghost" className="w-full justify-start gap-3 py-2.5">
            <CreditCard className="w-4 h-4 text-muted" />
            <span className="text-sm">خرید اعتبار</span>
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start gap-3 py-2.5">
          <Settings className="w-4 h-4 text-muted" />
          <span className="text-sm">تنظیمات</span>
        </Button>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">خروج</span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full py-2.5 mt-2"
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
      <aside className="hidden lg:flex w-72 h-screen fixed right-0 top-0 border-l border-border/50">
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
