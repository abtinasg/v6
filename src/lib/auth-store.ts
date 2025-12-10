// In-memory OTP store (use database in production)
export const otpStore = new Map<string, { code: string; expiresAt: Date }>();

// In-memory user store (use database in production)
export const usersStore = new Map<string, {
  id: string;
  phone: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  settings: Record<string, unknown>;
}>();
