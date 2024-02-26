import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { Module } from '@nestjs/common';
import { StripePaymentGatewayProvider } from './stripe-payment-gateway.provider';
import { CreatePaymentIntent } from '@domain/payment/application/use-cases/create-payment-intent';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { SubscribeUserToPayment } from '@domain/auth/application/useCases/subscribe-user';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [
    SubscribeUserToPayment,
    FindUserByIdUseCase,
    CreatePaymentIntent,
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayProvider,
    },
  ],
  exports: [CreatePaymentIntent],
})
export class PaymentModule {}
