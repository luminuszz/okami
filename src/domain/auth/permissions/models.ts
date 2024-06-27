import { z } from 'zod';

const workModel = z.object({
  id: z.string(),
  userId: z.string(),
  __typename: z.literal('Work'),
});

const accessTokenModel = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  __typename: z.literal('AccessToken'),
});

type Work = z.infer<typeof workModel>;

type AccessToken = z.infer<typeof accessTokenModel>;

export { workModel, accessTokenModel, Work, AccessToken };
