import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { EnvService } from '../../env/env.service';
import { User } from '@domain/auth/enterprise/entities/User';

@Injectable()
export class StripePaymentGatewayProvider implements PaymentGateway {
  private readonly stripe: Stripe;

  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'));
  }
  async registerCustomer(user: User): Promise<{ customerId: string }> {
    const existsCostumer = await this.stripe.customers.list({ email: user.email });

    if (!!existsCostumer.data.length) {
      return {
        customerId: existsCostumer.data[0].id,
      };
    }

    const newCustomer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
      preferred_locales: ['pt-BR'],
    });

    return {
      customerId: newCustomer.id,
    };
  }

  async createPaymentIntent(user: User): Promise<{ paymentSessionId: string }> {
    const results = await this.stripe.checkout.sessions.create({
      success_url: this.env.get('STRIPE_SUCCESS_URL'),
      cancel_url: this.env.get('STRIPE_ERROR_URL'),
      client_reference_id: user.id,
      customer: user.paymentSubscriberId,
      locale: 'pt-BR',
      mode: 'subscription',
      line_items: [
        {
          price: this.env.get('STRIPE_PRODUCT_PRICE_ID'),
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        },
      ],
    });

    return {
      paymentSessionId: results.url,
    };
  }

  public async buildWebhookEvent(body: string | Buffer, signature: string): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(body, signature, this.env.get('STRIPE_WEBHOOK_SECRET'));
  }
}
