'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, CreditCard, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { CREDIT_PACKAGES } from '@/types';
import { formatCredits } from '@/lib/utils';
import Link from 'next/link';

export default function CreditsPage() {
  const { user, isAuthenticated, setShowAuthModal } = useAppStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setSelectedPackage(packageId);

    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // In production, redirect to payment gateway
        alert(`در نسخه واقعی، به درگاه پرداخت هدایت می‌شوید.\nشناسه تراکنش: ${data.transactionId}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(false);
      setSelectedPackage(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground lg:mr-72">
      {/* Header */}
      <header className="bg-background-elevated/80 backdrop-blur border-b border-border-subtle px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4 justify-between">
          <Link href="/">
            <Button variant="secondary" size="sm" className="rounded-xl gap-2">
              <ArrowRight className="w-4 h-4 ml-1" />
              بازگشت
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">خرید اعتبار</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Current Balance */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-surface to-surface-elevated rounded-3xl p-6 sm:p-7 border border-border-subtle shadow-depth"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-dark/80 mb-1">موجودی فعلی</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold">{formatCredits(user.credits)}</span>
                  <span className="text-xl">💎</span>
                </div>
              </div>
              <Sparkles className="w-12 h-12 text-accent/60" />
            </div>
          </motion.div>
        )}

        {/* Packages */}
        <div className="grid md:grid-cols-2 gap-4">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`relative rounded-2xl p-6 border transition-all cursor-pointer shadow-soft bg-surface ${
                pkg.popular
                  ? 'border-accent/50 shadow-glow-soft'
                  : 'border-border-subtle hover:border-accent/30'
              }`}
              onClick={() => handlePurchase(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-background text-xs font-semibold px-3 py-1 rounded-full shadow-glow-soft">
                  پرطرفدار
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{pkg.name}</h3>
                  <p className="text-muted text-sm">{formatCredits(pkg.credits)} اعتبار</p>
                </div>
                <div className="text-3xl">💎</div>
              </div>

              <div className="mb-5">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPrice(pkg.price)}
                </span>
                <span className="text-muted text-sm mr-1">تومان</span>
              </div>

              <Button
                className="w-full rounded-xl"
                variant={pkg.popular ? 'primary' : 'secondary'}
                isLoading={isLoading && selectedPackage === pkg.id}
              >
                خرید
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="rounded-2xl p-6 border border-border-subtle bg-surface-elevated shadow-soft space-y-4">
          <h3 className="text-lg font-bold">مزایای خرید اعتبار</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">بدون انقضا</h4>
                <p className="text-sm text-muted">اعتبار شما هرگز منقضی نمی‌شود</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">دسترسی کامل</h4>
                <p className="text-sm text-muted">به تمام مدل‌ها و حالت‌ها</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-300" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">پرداخت امن</h4>
                <p className="text-sm text-muted">با درگاه‌های معتبر ایرانی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center pb-4">
          <div className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border-subtle text-muted">
            <CreditCard className="w-5 h-5 text-muted" />
            <span className="text-sm">پشتیبانی از تمام کارت‌های بانکی ایران</span>
          </div>
        </div>
      </main>
    </div>
  );
}
