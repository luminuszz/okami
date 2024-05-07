import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { stripeEventSchema } from '@app/infra/payment/stripe/parse-stripe-events';
import { StripePaymentGatewayProvider } from '@app/infra/payment/stripe/stripe-payment-gateway.provider';
import { PaymentSubscriptionStatus } from '@domain/auth/enterprise/entities/User';
import { ConfirmPaymentCheckout } from '@domain/payment/application/use-cases/confirm-payment-checkout';
import { CreatePaymentCheckout } from '@domain/payment/application/use-cases/create-payment-checkout';
import { UpdatePaymentSubscription } from '@domain/payment/application/use-cases/update-payment-subscription';
import { BadRequestException, Controller, Logger, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { User } from '../user-auth.decorator';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentCheckout: CreatePaymentCheckout,
    private readonly stripePaymentGateway: StripePaymentGatewayProvider,
    private readonly confirmPaymentCheckout: ConfirmPaymentCheckout,
    private readonly updatePaymentSubscriptionStatus: UpdatePaymentSubscription,
  ) {}

  private logger = new Logger(PaymentController.name);

  @UseGuards(AuthGuard)
  @Post('checkout')
  async createIntentPayment(@User('id') userId: string) {
    const results = await this.createPaymentCheckout.execute({
      userId,
    });

    if (results.isLeft()) throw results.value;

    return {
      paymentSessionId: results.value.paymentSessionId,
    };
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<FastifyRequest>) {
    try {
      if (!req.rawBody) throw new BadRequestException('Webhook error no raw body');

      const stripeResponse = await this.stripePaymentGateway.buildWebhookEvent(
        req.rawBody,
        req.headers['stripe-signature'] as string,
      );

      const event = await stripeEventSchema.parseAsync(stripeResponse);

      switch (event.type) {
        case 'checkout.session.completed':
          const { client_reference_id, customer, subscription, status } = event.data.object;

          if (status === 'complete') {
            const results = await this.confirmPaymentCheckout.execute({
              paymentSubscriberId: customer,
              paymentSubscriptionId: subscription,
              userId: client_reference_id,
            });
            if (results.isLeft()) throw results.value;
          }
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscriptionEventData = event.data.object;

          this.logger.debug(`Subscription event data: ${JSON.stringify(subscriptionEventData)}`);

          const results = await this.updatePaymentSubscriptionStatus.execute({
            paymentSubscriptionId: subscriptionEventData.id,
            paymentSubscriberId: subscriptionEventData.customer,
            subscriptionStatus:
              subscriptionEventData.status === 'active'
                ? PaymentSubscriptionStatus.ACTIVE
                : PaymentSubscriptionStatus.INACTIVE,
          });

          if (results.isLeft()) throw results.value;

          break;

        default:
          this.logger.debug(`Unhandled event type: ${event.type}`);
      }
    } catch (e) {
      this.logger.error(e);

      return new BadRequestException('Webhook error');
    }
  }
}
