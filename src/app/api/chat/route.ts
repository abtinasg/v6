import { NextRequest, NextResponse } from 'next/server';
import { AI_MODELS, CHAT_MODES } from '@/lib/models';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callOpenRouter(
  modelId: string,
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const model = AI_MODELS.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Model not found: ${modelId}`);
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    // Fallback to demo mode if no API key
    return generateDemoResponse(modelId, messages[messages.length - 1]?.content || '');
  }

  const requestMessages: ChatMessage[] = [];
  
  if (systemPrompt) {
    requestMessages.push({ role: 'system', content: systemPrompt });
  }
  
  requestMessages.push(...messages);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'HUNO AI',
      },
      body: JSON.stringify({
        model: model.openRouterId,
        messages: requestMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      // Fallback to demo mode on API error
      return generateDemoResponse(modelId, messages[messages.length - 1]?.content || '');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'پاسخی دریافت نشد.';
  } catch (error) {
    console.error('OpenRouter request failed:', error);
    // Fallback to demo mode on network error
    return generateDemoResponse(modelId, messages[messages.length - 1]?.content || '');
  }
}

function generateDemoResponse(modelId: string, message: string): string {
  const model = AI_MODELS.find(m => m.id === modelId);
  const modelName = model?.name || 'AI';
  return `سلام! من ${modelName} هستم. پیام شما را دریافت کردم: "${message}"\n\nاین یک پاسخ نمونه است. برای استفاده از API واقعی، لطفاً کلید OPENROUTER_API_KEY را در فایل .env تنظیم کنید.`;
}

function getModeSystemPrompt(mode: string): string | undefined {
  const prompts: Record<string, string> = {
    analyze: 'You are an expert analyst. Provide deep, structured analysis with multiple perspectives. Format your response with clear sections.',
    brainstorm: 'You are a creative ideation expert. Generate diverse, innovative ideas and possibilities. Be imaginative and think outside the box.',
    debate: 'You are participating in a debate. Present your arguments clearly and consider counterarguments. Be persuasive but fair.',
    solve: 'You are a problem-solving expert. Break down problems systematically and provide actionable solutions step by step.',
  };
  return prompts[mode];
}

export async function POST(request: NextRequest) {
  try {
    const { message, models, mode, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'پیام نامعتبر است' },
        { status: 400 }
      );
    }

    const selectedModels = models || ['gpt-4.1'];
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

    // TODO: In production, verify user credits from database before proceeding
    // and deduct credits after successful response

    // Prepare chat history
    const chatHistory: ChatMessage[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (msg.role && msg.content) {
          chatHistory.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        }
      }
    }
    chatHistory.push({ role: 'user', content: message });

    const responses: { model: string; content: string }[] = [];
    const systemPrompt = getModeSystemPrompt(chatMode);

    // Generate responses based on mode
    if (modeConfig?.multiAgent && selectedModels.length > 1) {
      // Multi-agent mode: each model contributes
      for (const modelId of selectedModels) {
        const model = AI_MODELS.find(m => m.id === modelId);
        if (model) {
          const content = await callOpenRouter(modelId, chatHistory, systemPrompt);
          responses.push({
            model: modelId,
            content,
          });
        }
      }
    } else {
      // Single agent mode
      const modelId = selectedModels[0];
      const content = await callOpenRouter(modelId, chatHistory, systemPrompt);
      responses.push({
        model: modelId,
        content,
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
