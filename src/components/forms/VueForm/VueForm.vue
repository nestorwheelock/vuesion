<template>
  <form :class="$style.vueForm" @submit.prevent="onSubmit">
    <slot :errors="errors" :valid="valid" />
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  Ref,
  watch,
  UnwrapRef,
} from '@vue/composition-api';
import { registerFieldValidation } from '@/components/forms/VueForm/register-field-validation';
import { IField, IValidationRules } from '@/components/forms/VueForm/IForm';
import { isNullOrUndefined } from '@/components/utils';
import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import { IItem } from '@/interfaces/IItem';

export default defineComponent({
  name: 'VueForm',
  props: {
    validationDelay: { type: Number, default: 190 },
    onBlur: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const form = ref<Array<Ref<UnwrapRef<IField>>>>([]);
    const errors = computed(() => form.value.filter((field) => field.value.valid === false));
    const sanitizeValue = (value: unknown) => {
      if (isObject(value) && 'value' in value) {
        value = (value as IItem).value;
      }

      return value;
    };
    const valid = computed(() => {
      let allRequiredFieldsFilled = true;

      form.value.forEach((field) => {
        if (allRequiredFieldsFilled && field.value.required) {
          allRequiredFieldsFilled = validateRequired(sanitizeValue(field.value.value));
        }
      });

      return errors.value.length === 0 && allRequiredFieldsFilled === true;
    });
    const validateRequired = (value: any) => {
      if (isNullOrUndefined(value)) {
        return false;
      } else if (isString(value)) {
        return value.trim().length > 0;
      } else if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return value !== false;
      }
    };
    const validateMin = (value: unknown, min: number) => {
      if (isString(value)) {
        return value.trim().length >= min;
      }
    };
    const validateMax = (value: unknown, max: number) => {
      if (isString(value)) {
        return value.trim().length <= max;
      }
    };
    const validateRegex = (value: unknown, regex: any) => {
      if (isString(value)) {
        return regex.test(value);
      }
    };
    const validate = (fieldRef: Ref<UnwrapRef<IField>>, value: unknown) => {
      value = sanitizeValue(value);

      const rules = fieldRef.value.rules;
      let valid = true;

      if (valid && rules.required) {
        valid = validateRequired(value);
      }

      if (valid && rules.min) {
        valid = validateMin(value, rules.min);
      }

      if (valid && rules.max) {
        valid = validateMax(value, rules.max);
      }

      if (valid && rules.min && rules.max) {
        valid = validateMin(value, rules.min) && validateMax(value, rules.max);
      }

      if (valid && rules.email) {
        valid = String(value).includes('@');
      }

      if (valid && rules.integer) {
        valid = validateRegex(value, /^-?[0-9]+$/);
      }

      if (valid && rules.regex) {
        valid = validateRegex(value, rules.regex);
      }

      if (valid && rules.custom) {
        valid = rules.custom(value);
      }

      fieldRef.value.valid = valid;

      fieldRef.value.changed = true;
      fieldRef.value.validated = true;

      return valid;
    };
    const debouncedValidate = debounce(validate, props.validationDelay);
    const registerField = (id: string, value: Ref<unknown>, rules: IValidationRules, overrideOnBlur = false) => {
      const fieldRef = ref<IField>({
        id,
        rules,
        valid: null,
        changed: false,
        touched: false,
        required: rules.required || false,
        validated: false,
        value: value.value,
      });

      watch(value, (newValue) => {
        fieldRef.value.value = newValue;

        if (props.onBlur === true && overrideOnBlur === false && fieldRef.value.valid !== false) {
          return;
        }

        debouncedValidate(fieldRef, newValue);
      });

      form.value.push(fieldRef);

      return fieldRef;
    };

    provide(registerFieldValidation, registerField);

    const onFocus = (fieldRef: Ref<UnwrapRef<IField>>) => {
      fieldRef.value.touched = true;
    };
    const onBlur = (fieldRef: Ref<UnwrapRef<IField>>) => {
      validate(fieldRef, fieldRef.value.value);
    };

    onMounted(() => {
      form.value.forEach((fieldRef) => {
        const el = document.getElementById(fieldRef.value.id) as HTMLInputElement;

        el?.addEventListener('focus', () => onFocus(fieldRef));
        el?.addEventListener('click', () => onFocus(fieldRef));
        el?.addEventListener('blur', () => onBlur(fieldRef));
      });
    });

    onBeforeUnmount(() => {
      form.value.forEach((fieldRef) => {
        const el = document.getElementById(fieldRef.value.id) as HTMLInputElement;

        el?.removeEventListener('focus', () => onFocus(fieldRef));
        el?.removeEventListener('click', () => onFocus(fieldRef));
        el?.removeEventListener('blur', () => onBlur(fieldRef));
      });
    });

    const onSubmit = () => {
      form.value.forEach((fieldRef) => {
        validate(fieldRef, fieldRef.value.value);
      });

      if (valid.value) {
        emit('submit');
      }
    };

    return { form, errors, valid, onSubmit };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.vueForm {
  // this class is only applied if you add css properties
}
</style>
