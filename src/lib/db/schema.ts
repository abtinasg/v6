import { pgTable, text, timestamp, integer, uuid, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Chat mode enum for type safety
export const chatModeEnum = pgEnum('chat_mode', ['chat', 'analyze', 'brainstorm', 'debate', 'solve', 'roundtable']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull().unique(),
  credits: integer('credits').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  settings: jsonb('settings').default({}),
});

// OTP table for authentication
export const otps = pgTable('otps', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Chats table
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull().default('New Chat'),
  mode: chatModeEnum('mode').notNull().default('chat'),
  models: jsonb('models').default([]), // Selected AI models for this chat
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id').notNull().references(() => chats.id),
  role: text('role').notNull(), // user, assistant, system
  content: text('content').notNull(),
  model: text('model'), // Which AI model sent this (for multi-agent)
  persona: text('persona'), // For roundtable - which personality
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Credits transaction table
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(), // positive for purchase, negative for usage
  type: text('type').notNull(), // purchase, usage
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Memory table for long-term context
export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  chatId: uuid('chat_id').references(() => chats.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Roundtable personas
export const personas = pgTable('personas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  avatar: text('avatar'), // emoji or image URL
  description: text('description'),
  systemPrompt: text('system_prompt').notNull(),
  style: text('style'), // thinking style description
  category: text('category'), // tech, business, philosophy, etc.
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type Persona = typeof personas.$inferSelect;
