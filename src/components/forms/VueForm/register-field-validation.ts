import { InjectionKey, ref, Ref } from '@vue/composition-api';
import { IField, IValidationRules } from '@/components/forms/VueForm/IForm';

export const registerFieldValidation: InjectionKey<
  (id: string, value: Ref<unknown>, rules: IValidationRules, overrideOnBlur?: boolean) => Ref<IField>
> = Symbol('register a field for validation');

export const registerFieldValidationDefault = (
  id: string,
  value: Ref<unknown>,
  rules: IValidationRules,
  overrideOnBlur?: boolean, // eslint-disable-line
) =>
  ref({
    id,
    rules,
    valid: null,
    changed: false,
    touched: false,
    required: rules.required || false,
    validated: false,
    value: value.value,
  });
