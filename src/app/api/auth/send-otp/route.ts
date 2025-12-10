import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, validateIranianPhone } from '@/lib/utils';
import { otpStore } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !validateIranianPhone(phone)) {
      return NextResponse.json(
        { error: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      );
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Store OTP (in production, use database)
    otpStore.set(phone, { code, expiresAt });

    // In production, send SMS here
    console.log(`[DEV] OTP for ${phone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد',
      // Only for development - remove in production
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال کد' },
      { status: 500 }
    );
  }
}
