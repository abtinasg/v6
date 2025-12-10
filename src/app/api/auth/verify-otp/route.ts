import { NextRequest, NextResponse } from 'next/server';
import { validateIranianPhone } from '@/lib/utils';
import { otpStore, usersStore } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !validateIranianPhone(phone)) {
      return NextResponse.json(
        { error: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'کد تایید نامعتبر است' },
        { status: 400 }
      );
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp) {
      return NextResponse.json(
        { error: 'کد تایید یافت نشد. لطفاً دوباره درخواست کنید.' },
        { status: 400 }
      );
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(phone);
      return NextResponse.json(
        { error: 'کد تایید منقضی شده است' },
        { status: 400 }
      );
    }

    if (storedOtp.code !== code) {
      return NextResponse.json(
        { error: 'کد تایید اشتباه است' },
        { status: 400 }
      );
    }

    // OTP is valid, clear it
    otpStore.delete(phone);

    // Get or create user
    let user = usersStore.get(phone);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        phone,
        credits: 50, // Welcome bonus
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {},
      };
      usersStore.set(phone, user);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        credits: user.credits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'خطا در تایید کد' },
      { status: 500 }
    );
  }
}
