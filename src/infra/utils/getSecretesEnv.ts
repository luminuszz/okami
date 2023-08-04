import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import * as process from 'process';

export interface EnvScretes {
  DATABASE_URL: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  DOCKERFILE: string;
  NOTION_AUTH_TOKEN: string;
  NOTION_DATABASE_ID: string;
  TELEGRAM_NOTIFICATION_BOT: string;
  TELEGRAM_CHAT_ID: string;
  PORT: number;
  ADDRESS: string;
  NEW_RELIC_LICENSE_KEY: string;
  NEW_RELIC_APP_NAME: string;
  AWS_S3_REGION: string;
  AWS_S3_BUCKET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_KEY_ACCESS: string;
  REDIS_HOST: string;
}

const secret_name = 'okami-server-envs';

const client = new SecretsManagerClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  },
});

let secrets: EnvScretes;

export default async () => {
  if (process.env.DOCKERFILE !== 'prod') return process.env as unknown as EnvScretes;

  if (secrets) return secrets;

  const { SecretString } = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
    }),
  );

  return JSON.parse(SecretString) as EnvScretes;
};
