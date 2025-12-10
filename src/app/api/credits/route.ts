import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PACKAGES } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { packageId, userId } = await request.json();

    if (!packageId || !userId) {
      return NextResponse.json(
        { error: 'اطلاعات نامعتبر است' },
        { status: 400 }
      );
    }

    const selectedPackage = CREDIT_PACKAGES.find(p => p.id === packageId);

    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'بسته انتخاب شده نامعتبر است' },
        { status: 400 }
      );
    }

    // In production, integrate with Iranian payment gateways (ZarinPal, etc.)
    // For demo, we'll simulate a successful payment

    const transactionId = crypto.randomUUID();

    // In production, create transaction record in database
    // and redirect to payment gateway

    return NextResponse.json({
      success: true,
      transactionId,
      package: selectedPackage,
      paymentUrl: `/api/credits/callback?transaction=${transactionId}`,
    });
  } catch (error) {
    console.error('Credits purchase error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    packages: CREDIT_PACKAGES,
  });
}
