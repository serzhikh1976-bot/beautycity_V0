import 'dotenv/config';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const redis = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const taskQueue = new Queue('beautycity-tasks', { connection: redis });

const taskWorker = new Worker(
  'beautycity-tasks',
  async (job) => {
    logger.info({ job: job.name, data: job.data }, 'Processing job');

    switch (job.name) {
      case 'reminder_35min':
        // TODO: отправить напоминание клиенту
        break;
      case 'auto_complete':
        // TODO: перевести запись в completed
        break;
      case 'close_chat':
        // TODO: закрыть чат
        break;
      case 'notify_master_new_booking':
        // TODO: уведомить мастера о новой заявке
        break;
      case 'notify_client_booking_status':
        // TODO: уведомить клиента о смене статуса
        break;
      default:
        logger.warn({ jobName: job.name }, 'Unknown job type');
    }
  },
  { connection: redis }
);

taskWorker.on('completed', (job) => {
  logger.info({ job: job.name, id: job.id }, 'Job completed');
});

taskWorker.on('failed', (job, err) => {
  logger.error({ job: job?.name, id: job?.id, err }, 'Job failed');
});

logger.info('Worker started');
