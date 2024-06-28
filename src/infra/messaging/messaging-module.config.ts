import { EnvService } from '@infra/env/env.service';
import { ClientProvider, ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const developConfigFactory = (_: EnvService): ClientProvider => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'okami-server-dev',
      brokers: ['kafka:9092'],
    },
    consumer: {
      groupId: 'okami-server-dev',
    },
  },
});

const productionConfigFactory = (env: EnvService): ClientProvider => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'okami-server',
      brokers: [env.get('KAFKA_BROKER')],
      ssl: true,
      sasl: {
        username: env.get('KAFKA_USER'),
        password: env.get('KAFKA_PASSWORD'),
        mechanism: 'scram-sha-256',
      },
    },

    consumer: {
      groupId: 'okami-server',
    },
  },
});

export const messageProviderConnectProvider: ClientsProviderAsyncOptions = {
  name: 'NOTIFICATION_SERVICE',
  useFactory: async (env: EnvService) => {
    const isisProduction = env.get('NODE_ENV') === 'production';
    if (isisProduction) {
      return productionConfigFactory(env);
    }
    return developConfigFactory(env);
  },
  inject: [EnvService],
};
