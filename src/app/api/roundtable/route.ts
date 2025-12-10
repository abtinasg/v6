import { NextRequest, NextResponse } from 'next/server';
import { ROUNDTABLE_PERSONAS } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { message, personas, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'پیام نامعتبر است' },
        { status: 400 }
      );
    }

    if (!personas || !Array.isArray(personas) || personas.length < 2) {
      return NextResponse.json(
        { error: 'حداقل ۲ شخصیت انتخاب کنید' },
        { status: 400 }
      );
    }

    const responses: { personaId: string; content: string }[] = [];

    // Generate response for each persona
    for (const personaId of personas) {
      const persona = ROUNDTABLE_PERSONAS.find(p => p.id === personaId);
      if (persona) {
        responses.push({
          personaId,
          content: generatePersonaResponse(persona, message, history),
        });
      }
    }

    return NextResponse.json({
      success: true,
      responses,
      creditsUsed: personas.length * 3, // 3 credits per persona
    });
  } catch (error) {
    console.error('Roundtable error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش پیام' },
      { status: 500 }
    );
  }
}

function generatePersonaResponse(
  persona: { id: string; name: string; nameFa: string; thinkingStyle: string },
  message: string,
  _history: unknown[]
): string {
  const responseTemplates: Record<string, string> = {
    'steve-jobs': `من همیشه به سادگی ایمان داشتم. در مورد "${message}"، باید بپرسیم: آیا این واقعاً جادویی است؟ آیا تجربه کاربر را متحول می‌کند؟ اگر نه، باید از نو شروع کنیم. نوآوری به معنای گفتن "نه" به هزار چیز است تا بتوانیم به یک چیز "بله" بگوییم.`,
    
    'elon-musk': `بیایید از اصول اولیه شروع کنیم. در مورد "${message}"، سوال اصلی این است: آیا از نظر فیزیکی ممکن است؟ اگر ممکن است، پس فقط مسئله مهندسی است. ما باید فکر کنیم که اگر می‌خواستیم این را از صفر بسازیم، چه می‌کردیم؟`,
    
    'naval-ravikant': `"${message}" - این موضوع جالبی است. به نظر من، باید بپرسیم: آیا این به ما آزادی بیشتری می‌دهد؟ ثروت واقعی یعنی بیدار شدن صبح و گفتن "من هر کاری که بخواهم انجام می‌دهم". هر تصمیمی باید ما را به این هدف نزدیک‌تر کند.`,
    
    'irvin-yalom': `وقتی به "${message}" فکر می‌کنم، می‌بینم که در نهایت همه چیز به معنا بازمی‌گردد. ما انسان‌ها موجوداتی هستیم که به دنبال معنا هستیم. سوال این است: این تصمیم چگونه به زندگی معنادارتر کمک می‌کند؟`,
    
    'ray-dalio': `من اصول مشخصی دارم. در مورد "${message}"، باید شفافیت رادیکال داشته باشیم. واقعیت چیست؟ چه ریسک‌هایی وجود دارد؟ بزرگ‌ترین اشتباهات من زمانی بود که واقعیت را نپذیرفتم. درد + تأمل = پیشرفت.`,
    
    'bill-gates': `در مورد "${message}"، باید به تأثیر فکر کنیم. من همیشه می‌پرسم: این چگونه زندگی میلیون‌ها نفر را بهتر می‌کند؟ تکنولوژی فقط ابزار است. نتیجه مهم است. باید داده‌ها را ببینیم و تحلیل کنیم.`,
    
    'dieter-rams': `"کمتر، اما بهتر" - این فلسفه من است. در مورد "${message}"، باید بپرسیم: آیا این ضروری است؟ آیا ساده است؟ آیا صادقانه است؟ طراحی خوب آن است که کمتر طراحی شده باشد.`,
    
    'charlie-munger': `باید از زاویه‌های مختلف به "${message}" نگاه کنیم. من همیشه می‌گویم: وارونه کن! به جای فکر کردن به موفقیت، فکر کن چطور شکست بخوری و بعد از آن اجتناب کن. احمق نباشید - این نصف راه است.`,
  };

  return responseTemplates[persona.id] || 
    `به عنوان ${persona.nameFa}، با سبک فکری "${persona.thinkingStyle}"، در مورد "${message}" باید بگویم که این موضوع نیاز به تفکر عمیق‌تر دارد. هر تصمیمی باید با دقت و از زوایای مختلف بررسی شود.`;
}
