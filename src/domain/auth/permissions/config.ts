import { AbilityBuilder, CreateAbility, createMongoAbility } from '@casl/ability';
import { User } from '@domain/auth/enterprise/entities/User';
import { AppAbility, permissions } from '@domain/auth/permissions/permissions';

export const createAppAbility = createMongoAbility() as unknown as CreateAbility<AppAbility>;

export function definePermissionsFor(User: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);

  const permissionsIsDefined = typeof permissions[User.role] === 'function';

  if (!permissionsIsDefined) {
    throw new Error('Permissions for user role is not defined');
  }

  permissions[User.role](User, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
