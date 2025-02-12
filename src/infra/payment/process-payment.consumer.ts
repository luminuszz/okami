import { PaymentSubscriptionStatus } from '@domain/auth/enterprise/entities/User'
import { ConfirmPaymentCheckout } from '@domain/payment/application/use-cases/confirm-payment-checkout'
import { UpdatePaymentSubscription } from '@domain/payment/application/use-cases/update-payment-subscription'
import { QueueProvider } from '@domain/work/application/contracts/queueProvider'
import {
  parseStripeCheckoutSessionSchema,
  parseStripeSubscriptionSchema,
} from '@infra/payment/stripe/parse-stripe-events'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import Stripe from 'stripe'

export const processPaymentQueueName = 'process-payment'

export interface ProcessPaymentPayload {
  event: Stripe.Event
}

@Injectable()
export class ProcessPaymentConsumer implements OnModuleInit {
  constructor(
    private readonly queue: QueueProvider,
    private readonly confirmPaymentCheckout: ConfirmPaymentCheckout,
    private readonly updatePaymentSubscriptionStatus: UpdatePaymentSubscription,
  ) {}

  private logger = new Logger(ProcessPaymentConsumer.name)

  async onModuleInit() {
    this.queue.subscribe<ProcessPaymentPayload>(processPaymentQueueName, this.process.bind(this))
  }

  async process({ event }: ProcessPaymentPayload) {
    switch (event.type) {
      case 'checkout.session.completed':
        const parsedEvent = await parseStripeCheckoutSessionSchema.parseAsync(event.data.object)

        const { client_reference_id, customer, subscription, status } = parsedEvent

        if (status === 'complete') {
          const results = await this.confirmPaymentCheckout.execute({
            paymentSubscriberId: customer,
            paymentSubscriptionId: subscription,
            userId: client_reference_id,
          })

          if (results.isLeft()) throw results.value
        }
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscriptionEventData = await parseStripeSubscriptionSchema.parseAsync(
          event.data.object as Stripe.Subscription,
        )

        const results = await this.updatePaymentSubscriptionStatus.execute({
          paymentSubscriptionId: subscriptionEventData.id,
          paymentSubscriberId: subscriptionEventData.customer,
          subscriptionStatus:
            subscriptionEventData.status === 'active'
              ? PaymentSubscriptionStatus.ACTIVE
              : PaymentSubscriptionStatus.INACTIVE,
        })

        if (results.isLeft()) throw results.value

        break

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`)
    }
  }
}
