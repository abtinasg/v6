import { NextRequest, NextResponse } from 'next/server';
import { AI_MODELS, CHAT_MODES } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { message, models, mode, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'پیام نامعتبر است' },
        { status: 400 }
      );
    }

    const selectedModels = models || ['gpt-5.1'];
    const chatMode = mode || 'chat';
    const modeConfig = CHAT_MODES.find(m => m.id === chatMode);

    // Calculate credits needed
    let creditsNeeded = 0;
    for (const modelId of selectedModels) {
      const model = AI_MODELS.find(m => m.id === modelId);
      if (model) {
        creditsNeeded += model.creditCost;
      }
    }

    // In production, verify user credits from database
    // For demo, we'll simulate responses

    const responses: { model: string; content: string }[] = [];

    // Generate responses based on mode
    if (modeConfig?.multiAgent && selectedModels.length > 1) {
      // Multi-agent mode: each model contributes
      for (const modelId of selectedModels) {
        const model = AI_MODELS.find(m => m.id === modelId);
        if (model) {
          responses.push({
            model: modelId,
            content: generateMockResponse(modelId, chatMode, message, history),
          });
        }
      }
    } else {
      // Single agent mode
      const modelId = selectedModels[0];
      responses.push({
        model: modelId,
        content: generateMockResponse(modelId, chatMode, message, history),
      });
    }

    return NextResponse.json({
      success: true,
      responses,
      creditsUsed: creditsNeeded,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش پیام' },
      { status: 500 }
    );
  }
}

function generateMockResponse(modelId: string, mode: string, message: string, _history: unknown[]): string {
  const model = AI_MODELS.find(m => m.id === modelId);
  const modelName = model?.name || 'AI';

  const modeResponses: Record<string, string> = {
    chat: `سلام! من ${modelName} هستم. پیام شما را دریافت کردم: "${message}"\n\nاین یک پاسخ نمونه است. در نسخه واقعی، این پاسخ از API هوش مصنوعی ${modelName} دریافت می‌شود.`,
    
    analyze: `📊 تحلیل ${modelName}:\n\nموضوع مورد بررسی: "${message}"\n\n۱. نقطه قوت: این موضوع دارای پتانسیل بالایی است\n۲. نقطه ضعف: نیاز به بررسی بیشتر دارد\n۳. فرصت: امکان رشد وجود دارد\n۴. تهدید: رقابت در این حوزه زیاد است\n\nنتیجه‌گیری: پیشنهاد می‌شود قبل از تصمیم‌گیری، تحقیقات بیشتری انجام شود.`,
    
    brainstorm: `💡 ایده‌های ${modelName}:\n\nبا توجه به "${message}":\n\n۱. ایده اول: ایجاد یک پلتفرم نوآورانه\n۲. ایده دوم: استفاده از هوش مصنوعی برای بهبود فرآیند\n۳. ایده سوم: همکاری با استارتاپ‌های موجود\n۴. ایده چهارم: توسعه یک اپلیکیشن موبایل\n۵. ایده پنجم: ایجاد یک جامعه آنلاین\n\nهر کدام از این ایده‌ها قابلیت اجرا دارند!`,
    
    debate: `⚔️ موضع ${modelName}:\n\nدر مورد "${message}":\n\nمن معتقدم که این موضوع نیاز به بررسی عمیق‌تر دارد. دلایل من:\n\n۱. شواهد تاریخی نشان می‌دهد که...\n۲. از منظر علمی...\n۳. با توجه به تجربیات قبلی...\n\nاما باید نظر دیگر هوش‌های مصنوعی را هم شنید.`,
    
    solve: `🧩 راه‌حل ${modelName}:\n\nمسئله: "${message}"\n\nمراحل حل:\n\n۱. تعریف دقیق مسئله\n۲. جمع‌آوری اطلاعات\n۳. تحلیل گزینه‌ها\n۴. انتخاب بهترین راه‌حل\n۵. اجرا و ارزیابی\n\nپیشنهاد عملی: شروع از گام اول و پیش‌رفتن به صورت تدریجی`,
  };

  return modeResponses[mode] || modeResponses.chat;
}
