export interface User {
  id: string;
  phone: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  settings: Record<string, unknown>;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  mode: string;
  models: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  persona?: string;
  createdAt: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage';
  description?: string;
  createdAt: Date;
}

export interface Memory {
  id: string;
  userId: string;
  chatId?: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'starter', name: 'شروع', credits: 100, price: 49000 },
  { id: 'basic', name: 'پایه', credits: 500, price: 199000, popular: true },
  { id: 'pro', name: 'حرفه‌ای', credits: 1500, price: 499000 },
  { id: 'enterprise', name: 'سازمانی', credits: 5000, price: 1490000 },
];
