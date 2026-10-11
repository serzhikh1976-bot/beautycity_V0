import 'dotenv/config';
import Fastify from 'fastify';
import { Bot } from 'grammy';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = Fastify({ logger });

// TODO: загрузить список городов из БД, создать Bot-инстансы,
// настроить webhook роутинг по city_id / webhook_path

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    const port = Number(process.env.BOT_PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`Bot server listening on port ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
