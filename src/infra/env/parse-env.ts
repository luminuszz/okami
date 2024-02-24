import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  DOCKERFILE: z.string().optional(),
  NOTION_AUTH_TOKEN: z.string(),
  NOTION_DATABASE_ID: z.string(),
  TELEGRAM_NOTIFICATION_BOT: z.string(),
  TELEGRAM_CHAT_ID: z.string(),
  PORT: z.coerce.date(),
  ADDRESS: z.string(),
  NEW_RELIC_LICENSE_KEY: z.string(),
  NEW_RELIC_APP_NAME: z.string(),
  AWS_S3_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ACCESS: z.string(),
  JWT_SECRET: z.string(),
  WEB_PUSH_PRIVATE_KEY: z.string(),
  WEB_PUSH_PUBLIC_KEY: z.string(),
  CURRENT_USER_ID: z.string(),
  AMQP_URL: z.string(),
  ONE_SIGNAL_API_TOKEN: z.string(),
  ONE_SIGNAL_SERVICE_ENDPOINT: z.string(),
  ONE_SIGNAL_APP_ID: z.string(),
});

export type EnvSecrets = z.infer<typeof envSchema>;