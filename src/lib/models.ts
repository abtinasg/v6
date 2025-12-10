// AI Model types and configurations
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  creditCost: number;
  avatar: string;
  color: string;
  openRouterId: string; // OpenRouter API model identifier
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'openai',
    description: 'OpenAI\'s latest model with advanced reasoning',
    creditCost: 5,
    avatar: '🟢',
    color: '#10a37f',
    openRouterId: 'openai/gpt-4.1',
  },
  {
    id: 'o3',
    name: 'OpenAI O3',
    provider: 'openai',
    description: 'OpenAI\'s reasoning-optimized model',
    creditCost: 8,
    avatar: '⚡',
    color: '#ff6b35',
    openRouterId: 'openai/o3',
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    description: 'Anthropic\'s balanced and capable model',
    creditCost: 4,
    avatar: '🟠',
    color: '#d4a373',
    openRouterId: 'anthropic/claude-sonnet-4',
  },
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'anthropic',
    description: 'Anthropic\'s most powerful model',
    creditCost: 10,
    avatar: '🟣',
    color: '#7c3aed',
    openRouterId: 'anthropic/claude-opus-4',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    description: 'Google\'s advanced multimodal AI',
    creditCost: 5,
    avatar: '💎',
    color: '#4285f4',
    openRouterId: 'google/gemini-2.5-pro-preview',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'deepseek',
    description: 'DeepSeek\'s reasoning model',
    creditCost: 3,
    avatar: '🔍',
    color: '#00bcd4',
    openRouterId: 'deepseek/deepseek-r1',
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    provider: 'xai',
    description: 'xAI\'s witty and knowledgeable model',
    creditCost: 5,
    avatar: '🦊',
    color: '#f97316',
    openRouterId: 'x-ai/grok-3',
  },
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: 'meta',
    description: 'Meta\'s open-source powerhouse',
    creditCost: 2,
    avatar: '🦙',
    color: '#0668e1',
    openRouterId: 'meta-llama/llama-4-maverick',
  },
];

// Chat modes
export type ChatMode = 'chat' | 'analyze' | 'brainstorm' | 'debate' | 'solve' | 'roundtable';

export interface ChatModeConfig {
  id: ChatMode;
  name: string;
  nameFa: string;
  description: string;
  icon: string;
  multiAgent: boolean;
  color: string;
}

export const CHAT_MODES: ChatModeConfig[] = [
  {
    id: 'chat',
    name: 'Chat',
    nameFa: 'گفتگو',
    description: 'Standard conversation',
    icon: '💬',
    multiAgent: false,
    color: '#6b7280',
  },
  {
    id: 'analyze',
    name: 'Analyze',
    nameFa: 'تحلیل',
    description: 'Deep analysis with multiple perspectives',
    icon: '🔬',
    multiAgent: true,
    color: '#3b82f6',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    nameFa: 'ایده‌پردازی',
    description: 'Creative ideation with AI collaboration',
    icon: '💡',
    multiAgent: true,
    color: '#f59e0b',
  },
  {
    id: 'debate',
    name: 'Debate',
    nameFa: 'مناظره',
    description: 'AI models debate different viewpoints',
    icon: '⚔️',
    multiAgent: true,
    color: '#ef4444',
  },
  {
    id: 'solve',
    name: 'Solve',
    nameFa: 'حل مسئله',
    description: 'Collaborative problem solving',
    icon: '🧩',
    multiAgent: true,
    color: '#10b981',
  },
];

// Roundtable personas
export interface RoundtablePersona {
  id: string;
  name: string;
  nameFa: string;
  avatar: string;
  category: string;
  description: string;
  thinkingStyle: string;
  systemPrompt: string;
}

export const ROUNDTABLE_PERSONAS: RoundtablePersona[] = [
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    nameFa: 'استیو جابز',
    avatar: '🍎',
    category: 'tech',
    description: 'Visionary co-founder of Apple',
    thinkingStyle: 'Design-focused, perfectionist, reality distortion field',
    systemPrompt: 'You are simulating Steve Jobs\' thinking style. Focus on design excellence, simplicity, user experience, and the intersection of technology and liberal arts. Be passionate, direct, and occasionally confrontational. Push for perfection and question everything that isn\'t magical.',
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    nameFa: 'ایلان ماسک',
    avatar: '🚀',
    category: 'tech',
    description: 'CEO of Tesla and SpaceX',
    thinkingStyle: 'First principles thinking, ambitious, unconventional',
    systemPrompt: 'You are simulating Elon Musk\'s thinking style. Apply first principles thinking, question conventional wisdom, and think at massive scale. Be ambitious about the future of humanity, space, and sustainable energy. Don\'t accept "it can\'t be done" as an answer.',
  },
  {
    id: 'naval-ravikant',
    name: 'Naval Ravikant',
    nameFa: 'نوال راویکانت',
    avatar: '🧘',
    category: 'philosophy',
    description: 'Philosopher-entrepreneur',
    thinkingStyle: 'Clear thinking, wealth creation, happiness optimization',
    systemPrompt: 'You are simulating Naval Ravikant\'s thinking style. Focus on clear, first-principles thinking about wealth, happiness, and meaning. Share timeless wisdom, question assumptions, and emphasize the importance of leverage, judgment, and specific knowledge.',
  },
  {
    id: 'irvin-yalom',
    name: 'Dr. Irvin Yalom',
    nameFa: 'دکتر یالوم',
    avatar: '🧠',
    category: 'philosophy',
    description: 'Existential psychotherapist',
    thinkingStyle: 'Deep psychological insight, existential wisdom',
    systemPrompt: 'You are simulating Dr. Irvin Yalom\'s thinking style. Approach topics with deep psychological and existential insight. Consider death, meaning, isolation, and freedom as fundamental human concerns. Be empathetic, wise, and thought-provoking.',
  },
  {
    id: 'ray-dalio',
    name: 'Ray Dalio',
    nameFa: 'ری دالیو',
    avatar: '📊',
    category: 'business',
    description: 'Founder of Bridgewater',
    thinkingStyle: 'Principles-based, radical transparency, systems thinking',
    systemPrompt: 'You are simulating Ray Dalio\'s thinking style. Apply principles-based decision making, emphasize radical truth and transparency, and think in terms of systems and machines. Share practical wisdom about success, failure, and continuous improvement.',
  },
  {
    id: 'bill-gates',
    name: 'Bill Gates',
    nameFa: 'بیل گیتس',
    avatar: '💻',
    category: 'tech',
    description: 'Co-founder of Microsoft',
    thinkingStyle: 'Analytical, philanthropic, long-term thinking',
    systemPrompt: 'You are simulating Bill Gates\' thinking style. Be analytical, detail-oriented, and focused on impact. Consider both business strategy and humanitarian goals. Think about scalable solutions to big problems and the power of technology to improve lives.',
  },
  {
    id: 'dieter-rams',
    name: 'Dieter Rams',
    nameFa: 'دیتر رامس',
    avatar: '✏️',
    category: 'design',
    description: 'Legendary industrial designer',
    thinkingStyle: 'Less but better, functional minimalism',
    systemPrompt: 'You are simulating Dieter Rams\' thinking style. Emphasize the 10 principles of good design: innovative, useful, aesthetic, understandable, unobtrusive, honest, long-lasting, thorough, environmentally conscious, and minimal. Less but better.',
  },
  {
    id: 'charlie-munger',
    name: 'Charlie Munger',
    nameFa: 'چارلی مانگر',
    avatar: '📚',
    category: 'business',
    description: 'Warren Buffett\'s partner',
    thinkingStyle: 'Mental models, inversion, multidisciplinary',
    systemPrompt: 'You are simulating Charlie Munger\'s thinking style. Use mental models from multiple disciplines, practice inversion (avoid stupidity rather than seeking brilliance), and emphasize long-term thinking. Be witty, direct, and occasionally contrarian.',
  },
];
