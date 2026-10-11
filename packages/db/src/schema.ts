import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  time,
  date,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const bookingStatusEnum = pgEnum('booking_status', [
  'draft',
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);

export const cancelledByEnum = pgEnum('cancelled_by', [
  'client',
  'master',
  'manager',
  'system',
]);

export const chatTypeEnum = pgEnum('chat_type', [
  'client_master',
  'client_manager',
]);

export const senderTypeEnum = pgEnum('sender_type', [
  'client',
  'master',
  'manager',
]);

// --- cities ---
export const cities = pgTable('cities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  botToken: text('bot_token').notNull(),
  botUsername: text('bot_username').notNull(),
  webhookPath: text('webhook_path').notNull().unique(),
  managerTelegramId: text('manager_telegram_id'),
  managerPasswordHash: text('manager_password_hash'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- clients ---
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  telegramId: text('telegram_id').notNull().unique(),
  telegramName: text('telegram_name').notNull(),
  alias: text('alias'),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- masters ---
export const masters = pgTable(
  'masters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id')
      .notNull()
      .references(() => cities.id),
    telegramId: text('telegram_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    avatarFileId: text('avatar_file_id'),
    district: text('district'),
    subdistrict: text('subdistrict'),
    locationNote: text('location_note'),
    portfolioFileIds: text('portfolio_file_ids').array(),
    isBlocked: boolean('is_blocked').notNull().default(false),
    isDeleted: boolean('is_deleted').notNull().default(false),
    completedOrdersCount: integer('completed_orders_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueCityTelegram: uniqueIndex('unique_city_telegram').on(table.cityId, table.telegramId),
  })
);

// --- services ---
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  defaultDurationMin: integer('default_duration_min').notNull(),
  minDurationMin: integer('min_duration_min').notNull(),
  maxDurationMin: integer('max_duration_min').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- city_services ---
export const cityServices = pgTable(
  'city_services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id')
      .notNull()
      .references(() => cities.id),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => ({
    uniqueCityService: uniqueIndex('unique_city_service').on(table.cityId, table.serviceId),
  })
);

// --- city_districts ---
export const cityDistricts = pgTable('city_districts', {
  id: uuid('id').primaryKey().defaultRandom(),
  cityId: uuid('city_id')
    .notNull()
    .references(() => cities.id),
  parentId: uuid('parent_id').references((): any => cityDistricts.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- master_services ---
export const masterServices = pgTable(
  'master_services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    masterId: uuid('master_id')
      .notNull()
      .references(() => masters.id),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),
    price: integer('price').notNull(),
    durationMin: integer('duration_min').notNull(),
    subServices: jsonb('sub_services').$type<{ name: string; price: number }[] | null>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueMasterService: uniqueIndex('unique_master_service').on(table.masterId, table.serviceId),
  })
);

// --- master_schedules ---
export const masterSchedules = pgTable('master_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  masterId: uuid('master_id')
    .notNull()
    .references(() => masters.id),
  weekday: integer('weekday').notNull(), // 0–6
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  breakStart: time('break_start'),
  breakEnd: time('break_end'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- master_days_off ---
export const masterDaysOff = pgTable('master_days_off', {
  id: uuid('id').primaryKey().defaultRandom(),
  masterId: uuid('master_id')
    .notNull()
    .references(() => masters.id),
  date: date('date', { mode: 'date' }),
  weekday: integer('weekday'), // 0–6
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- bookings ---
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cityId: uuid('city_id')
      .notNull()
      .references(() => cities.id),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    masterId: uuid('master_id')
      .notNull()
      .references(() => masters.id),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),
    masterServiceId: uuid('master_service_id')
      .notNull()
      .references(() => masterServices.id),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    status: bookingStatusEnum('status').notNull(),
    priceAtBooking: integer('price_at_booking').notNull(),
    comment: text('comment'),
    cancelledBy: cancelledByEnum('cancelled_by'),
    cancelReason: text('cancel_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    masterStartIdx: index('bookings_master_start_idx').on(table.masterId, table.startAt),
    clientIdx: index('bookings_client_idx').on(table.clientId),
    statusIdx: index('bookings_status_idx').on(table.status),
  })
);

// --- reviews ---
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id)
    .unique(),
  masterId: uuid('master_id')
    .notNull()
    .references(() => masters.id),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id),
  rating: integer('rating').notNull(),
  text: text('text'),
  masterReply: text('master_reply'),
  isHidden: boolean('is_hidden').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- chats ---
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  cityId: uuid('city_id')
    .notNull()
    .references(() => cities.id),
  type: chatTypeEnum('type').notNull(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id),
  masterId: uuid('master_id').references(() => masters.id),
  isClosed: boolean('is_closed').notNull().default(false),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }).notNull().defaultNow(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- messages ---
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id),
  senderType: senderTypeEnum('sender_type').notNull(),
  senderId: uuid('sender_id').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- chat_bans ---
export const chatBans = pgTable('chat_bans', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id),
  bannedByMasterId: uuid('banned_by_master_id')
    .notNull()
    .references(() => masters.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
