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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              بازگشت
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">خرید اعتبار</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Balance */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">موجودی فعلی</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{formatCredits(user.credits)}</span>
                  <span className="text-xl">💎</span>
                </div>
              </div>
              <Sparkles className="w-12 h-12 text-gray-600" />
            </div>
          </motion.div>
        )}

        {/* Packages */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                pkg.popular
                  ? 'border-gray-900 shadow-lg'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
              onClick={() => handlePurchase(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                  پرطرفدار
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm">{formatCredits(pkg.credits)} اعتبار</p>
                </div>
                <div className="text-3xl">💎</div>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(pkg.price)}
                </span>
                <span className="text-gray-500 text-sm mr-1">تومان</span>
              </div>

              <Button
                className="w-full"
                variant={pkg.popular ? 'primary' : 'secondary'}
                isLoading={isLoading && selectedPackage === pkg.id}
              >
                خرید
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">مزایای خرید اعتبار</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">بدون انقضا</h4>
                <p className="text-sm text-gray-500">اعتبار شما هرگز منقضی نمی‌شود</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">دسترسی کامل</h4>
                <p className="text-sm text-gray-500">به تمام مدل‌ها و حالت‌ها</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">پرداخت امن</h4>
                <p className="text-sm text-gray-500">با درگاه‌های معتبر ایرانی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <CreditCard className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">پشتیبانی از تمام کارت‌های بانکی ایران</span>
          </div>
        </div>
      </main>
    </div>
  );
}
