import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { Module } from '@nestjs/common';
import { StripePaymentGatewayProvider } from './stripe/stripe-payment-gateway.provider';
import { CreatePaymentCheckout } from '@domain/payment/application/use-cases/create-payment-checkout';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { ConfirmPaymentCheckout } from '@domain/payment/application/use-cases/confirm-payment-checkout';
import { UpdatePaymentSubscription } from '@domain/payment/application/use-cases/update-payment-subscription';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [
    StripePaymentGatewayProvider,
    FindUserByIdUseCase,
    UpdatePaymentSubscription,
    CreatePaymentCheckout,
    ConfirmPaymentCheckout,
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayProvider,
    },
  ],
  exports: [CreatePaymentCheckout, StripePaymentGatewayProvider, ConfirmPaymentCheckout, UpdatePaymentSubscription],
})
export class PaymentModule {}
