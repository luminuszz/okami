import { AuthGuard } from '@app/infra/crqs/auth/auth.guard'
import { StripePaymentGatewayProvider } from '@app/infra/payment/stripe/stripe-payment-gateway.provider'
import { CreatePaymentCheckout } from '@domain/payment/application/use-cases/create-payment-checkout'
import { QueueProvider } from '@domain/work/application/contracts/queueProvider'
import { type ProcessPaymentPayload, processPaymentQueueName } from '@infra/payment/process-payment.consumer'
import { BadRequestException, Controller, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { User } from '../user-auth.decorator'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentCheckout: CreatePaymentCheckout,
    private readonly stripePaymentGateway: StripePaymentGatewayProvider,
    private readonly queue: QueueProvider,
  ) {}

  @UseGuards(AuthGuard)
  @Post('checkout')
  async createIntentPayment(@User('id') userId: string) {
    const results = await this.createPaymentCheckout.execute({
      userId,
    })

    if (results.isLeft()) throw results.value

    return {
      paymentSessionId: results.value.paymentSessionId,
    }
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<FastifyRequest>) {
    if (!req.rawBody) throw new BadRequestException('Webhook error no raw body')

    const event = await this.stripePaymentGateway.buildWebhookEvent(
      req.rawBody,
      req.headers['stripe-signature'] as string,
    )

    await this.queue.publish<ProcessPaymentPayload>(processPaymentQueueName, { event })
  }
}
