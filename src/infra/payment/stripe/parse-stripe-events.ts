import { z } from 'zod';

export const parseStripeCheckoutSessionSchema = z.object({
  client_reference_id: z.string().nonempty(),
  customer: z.string().nonempty(),
  status: z.enum(['complete', 'expired', 'open']),
  subscription: z.string().nonempty(),
});

export const parseStripeSubscriptionSchema = z.object({
  id: z.string().nonempty(),
  customer: z.string().nonempty(),
  status: z.enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid']),
});

export const stripeEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('customer.subscription.created').or(z.literal('customer.subscription.updated')),
    data: z.object({
      object: parseStripeSubscriptionSchema,
    }),
  }),
  z.object({
    type: z.literal('checkout.session.completed'),
    data: z.object({
      object: parseStripeCheckoutSessionSchema,
    }),
  }),

  z.object({
    type: z.literal(''),
  }),
]);

export type StripeEvent = z.infer<typeof stripeEventSchema>;
