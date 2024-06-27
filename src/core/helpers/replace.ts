export type Replace<OriginalType, FieldsToReplace extends Partial<OriginalType>> = Omit<
  OriginalType,
  keyof FieldsToReplace
> &
  FieldsToReplace;
