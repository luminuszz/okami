import { z } from 'zod';
import { workModel, accessTokenModel } from '@domain/auth/permissions/models';

const workSubject = z.tuple([
  z.union([z.literal('create'), z.literal('update'), z.literal('delete'), z.literal('read')]),
  z.union([workModel, z.literal('Work')]),
]);

const accessTokenSubject = z.tuple([
  z.union([z.literal('create'), z.literal('delete'), z.literal('update')]),
  z.union([z.literal('AccessToken'), accessTokenModel]),
]);

const adminSubject = z.tuple([z.literal('manage'), z.literal('all')]);

type WorkSubject = z.infer<typeof workSubject>;
type AccessTokenSubject = z.infer<typeof accessTokenSubject>;
type AdminSubject = z.infer<typeof adminSubject>;

const allSubjects = z.union([workSubject, accessTokenSubject, adminSubject]);

export { workSubject, accessTokenSubject, WorkSubject, AccessTokenSubject, adminSubject, AdminSubject, allSubjects };
