'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { validateIranianPhone } from '@/lib/utils';
import { motion } from 'framer-motion';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, setUser } = useAppStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateIranianPhone(phone)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      if (res.ok) {
        setStep('otp');
        setCountdown(120);
      } else {
        const data = await res.json();
        setError(data.error || 'خطا در ارسال کد');
      }
    } catch {
      setError('خطا در برقراری ارتباط');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(digit => digit !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        setShowAuthModal(false);
        resetForm();
      } else {
        setError(data.error || 'کد نادرست است');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch {
      setError('خطا در برقراری ارتباط');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setCountdown(0);
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      if (res.ok) {
        setCountdown(120);
        setOtp(['', '', '', '', '', '']);
        setError('');
      }
    } catch {
      setError('خطا در ارسال مجدد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'phone' ? 'ورود به حساب کاربری' : 'تایید شماره موبایل'}
        </h2>
        <p className="text-gray-500">
          {step === 'phone' 
            ? 'برای ادامه، شماره موبایل خود را وارد کنید'
            : `کد ۶ رقمی ارسال شده به ${phone} را وارد کنید`
          }
        </p>
      </div>

      {step === 'phone' ? (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handlePhoneSubmit}
          className="space-y-4"
        >
          <Input
            type="tel"
            placeholder="09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-center text-lg tracking-widest"
            dir="ltr"
            error={error}
          />
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            ارسال کد تایید
          </Button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-center gap-2" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
              />
            ))}
          </div>
          
          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}
          
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-gray-500">
                ارسال مجدد کد تا {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-gray-700 font-medium hover:text-black transition-colors"
                disabled={isLoading}
              >
                ارسال مجدد کد
              </button>
            )}
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setStep('phone')}
            className="w-full"
          >
            تغییر شماره موبایل
          </Button>
        </motion.div>
      )}
    </Modal>
  );
}
