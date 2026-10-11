import { z } from 'zod';

export const BookingStatus = z.enum([
  'draft',
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);
export type BookingStatus = z.infer<typeof BookingStatus>;

export const CancelledBy = z.enum([
  'client',
  'master',
  'manager',
  'system',
]);
export type CancelledBy = z.infer<typeof CancelledBy>;

export const ChatType = z.enum(['client_master', 'client_manager']);
export type ChatType = z.infer<typeof ChatType>;

export const SenderType = z.enum(['client', 'master', 'manager']);
export type SenderType = z.infer<typeof SenderType>;

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  botToken: z.string().min(1),
  botUsername: z.string().min(1),
  webhookPath: z.string().min(1),
  managerTelegramId: z.string().nullable(),
  managerPasswordHash: z.string().nullable(),
  isActive: z.boolean().default(true),
});

export const clientSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.string(),
  telegramName: z.string(),
  alias: z.string().nullable(),
  phone: z.string().nullable(),
});

export const masterSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  telegramId: z.string(),
  name: z.string().min(1),
  description: z.string().nullable(),
  avatarFileId: z.string().nullable(),
  district: z.string().nullable(),
  subdistrict: z.string().nullable(),
  locationNote: z.string().nullable(),
  portfolioFileIds: z.array(z.string()).nullable(),
  isBlocked: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  completedOrdersCount: z.number().int().default(0),
});

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  defaultDurationMin: z.number().int().positive(),
  minDurationMin: z.number().int().positive(),
  maxDurationMin: z.number().int().positive(),
  isActive: z.boolean().default(true),
});

export const subServiceSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const masterServiceSchema = z.object({
  id: z.string().uuid(),
  masterId: z.string().uuid(),
  serviceId: z.string().uuid(),
  price: z.number().int().nonnegative(),
  durationMin: z.number().int().positive(),
  subServices: z.array(subServiceSchema).nullable(),
});

export const bookingSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  clientId: z.string().uuid(),
  masterId: z.string().uuid(),
  serviceId: z.string().uuid(),
  masterServiceId: z.string().uuid(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  status: BookingStatus,
  priceAtBooking: z.number().int().nonnegative(),
  comment: z.string().nullable(),
  cancelledBy: CancelledBy.nullable(),
  cancelReason: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  masterId: z.string().uuid(),
  clientId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().nullable(),
  masterReply: z.string().nullable(),
  isHidden: z.boolean().default(false),
});

export const chatSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  type: ChatType,
  clientId: z.string().uuid(),
  masterId: z.string().uuid().nullable(),
  isClosed: z.boolean().default(false),
  closedAt: z.coerce.date().nullable(),
  lastMessageAt: z.coerce.date(),
  isDeleted: z.boolean().default(false),
});

export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  senderType: SenderType,
  senderId: z.string().uuid(),
  text: z.string().min(1),
  createdAt: z.coerce.date(),
});
