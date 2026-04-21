import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ============ USER SYSTEM ============
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  nickname: text('nickname').notNull().unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  role: text('role').notNull().default('user'),
  isPremium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
  isBanned: integer('is_banned', { mode: 'boolean' }).notNull().default(false),
  banReason: text('ban_reason'),
  discordId: text('discord_id').unique(),
  discordLinked: integer('discord_linked', { mode: 'boolean' }).notNull().default(false),
  locale: text('locale').notNull().default('es'),
  rememberToken: text('remember_token').unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============ COMMENTS ============
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  parentId: text('parent_id'),
  targetId: text('target_id').notNull(),
  targetType: text('target_type').notNull(),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
  isReported: integer('is_reported', { mode: 'boolean' }).notNull().default(false),
  reportCount: integer('report_count').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============ REACTIONS ============
export const reactions = sqliteTable('reactions', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  commentId: text('comment_id').notNull().references(() => comments.id),
  createdAt: text('created_at').notNull(),
});

// ============ NOTIFICATIONS ============
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  link: text('link'),
  createdAt: text('created_at').notNull(),
});

// ============ ACTIVITY LOGS ============
export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
});

// ============ DISCORD CONFIG ============
export const discordConfigs = sqliteTable('discord_configs', {
  id: text('id').primaryKey(),
  botToken: text('bot_token'),
  serverId: text('server_id'),
  channelId: text('channel_id'),
  webhookUrl: text('webhook_url'),
  modRoleId: text('mod_role_id'),
  adminRoleId: text('admin_role_id'),
  collabRoleId: text('collab_role_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============ DONATIONS ============
export const donations = sqliteTable('donations', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  nickname: text('nickname').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  platform: text('platform').notNull().default('ko-fi'),
  message: text('message'),
  createdAt: text('created_at').notNull(),
});

// ============ Types ============
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type DiscordConfig = typeof discordConfigs.$inferSelect;
export type Donation = typeof donations.$inferSelect;
