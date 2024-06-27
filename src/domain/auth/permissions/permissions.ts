import { z } from 'zod';
import { User, UserRole } from '@domain/auth/enterprise/entities/User';
import { AbilityBuilder, MongoAbility } from '@casl/ability';
import { allSubjects } from '@domain/auth/permissions/subjects';

export type AppAbilities = z.infer<typeof allSubjects>;

type AppAbility = MongoAbility<AppAbilities>;

const role = z.nativeEnum(UserRole);

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

type Role = z.infer<typeof role>;

const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all');
  },
  USER(user, { can }) {
    if (user.hasTrial) {
      can('create', 'Work');
    }

    can('update', 'Work', { userId: { $eq: user.id } });
    can('delete', 'Work', { userId: { $eq: user.id } });
  },
  SUBSCRIBED_USER(user, { can }) {
    can('create', 'Work');

    can('update', 'Work', { userId: { $eq: user.id } });
    can('delete', 'Work', { userId: { $eq: user.id } });
  },
};

export { role, permissions, PermissionsByRole, AppAbility };
