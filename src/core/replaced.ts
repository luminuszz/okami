export type Replace<OriginalType, TypeForReplace extends Partial<OriginalType>> = Omit<
  OriginalType,
  keyof TypeForReplace
> &
  TypeForReplace;
