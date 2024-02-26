import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { EnvService } from '../env/env.service';
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
    });

    return {
      customerId: newCustomer.id,
    };
  }

  async createPaymentIntent(customerId: string): Promise<{ paymentSessionId: string }> {
    const results = await this.stripe.checkout.sessions.create({
      success_url: this.env.get('STRIPE_SUCCESS_URL'),
      cancel_url: this.env.get('STRIPE_ERROR_URL'),
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1OntVODbLdmMyhWWQSwF2hbP',
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
}
