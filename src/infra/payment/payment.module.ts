import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway'
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id'
import { ConfirmPaymentCheckout } from '@domain/payment/application/use-cases/confirm-payment-checkout'
import { CreatePaymentCheckout } from '@domain/payment/application/use-cases/create-payment-checkout'
import { UpdatePaymentSubscription } from '@domain/payment/application/use-cases/update-payment-subscription'
import { ProcessPaymentConsumer } from '@infra/payment/process-payment.consumer'
import { QueueModule } from '@infra/queue/queue.module'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { StripePaymentGatewayProvider } from './stripe/stripe-payment-gateway.provider'

@Module({
  imports: [EnvModule, DatabaseModule, QueueModule],
  providers: [
    ProcessPaymentConsumer,
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
