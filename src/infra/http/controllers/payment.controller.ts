import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { User } from '@app/infra/crqs/user-auth.decorator';
import { CreatePaymentIntent } from '@domain/payment/application/use-cases/create-payment-intent';
import { Controller, Logger, Post, UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly createPaymentIntent: CreatePaymentIntent) {}

  private logger = new Logger(PaymentController.name);

  @Post('intent')
  async createIntentPayment(@User('id') userId: string) {
    const results = await this.createPaymentIntent.execute({
      userId,
    });

    this.logger.log(results);

    if (results.isLeft()) throw results.value;

    return {
      paymentSessionId: results.value.paymentSessionId,
    };
  }
}
