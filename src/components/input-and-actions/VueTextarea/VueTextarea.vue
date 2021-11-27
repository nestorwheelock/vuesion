<template>
  <div :class="[$style.vueTextarea, disabled && $style.disabled, fieldValidation.valid === false && $style.error]">
    <vue-text
      :for="id"
      look="label"
      :color="fieldValidation.valid === false ? 'danger' : 'text-medium'"
      :class="[$style.label, hideLabel && 'sr-only']"
      as="label"
    >
      {{ label }}
      <sup v-if="required">*</sup>
    </vue-text>

    <textarea
      :id="id"
      ref="input"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :value="value"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      v-bind="$attrs"
      v-on="{
        ...$listeners,
        input: (e) => {
          $emit('input', e.target.value);
        },
      }"
    />

    <vue-text
      :color="fieldValidation.valid === false ? 'danger' : 'text-medium'"
      :class="[$style.description, hideDescription && 'sr-only']"
    >
      {{ fieldValidation.valid === false ? errorMessage : description }}
    </vue-text>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@vue/composition-api';
import { useIntersectionObserver } from '@/composables/use-intersection-observer';
import { getDomRef } from '@/composables/get-dom-ref';
import {
  registerFieldValidation,
  registerFieldValidationDefault,
} from '@/components/forms/VueForm/register-field-validation';
import VueText from '@/components/typography/VueText/VueText.vue';

export default defineComponent({
  name: 'VueTextarea',
  components: { VueText },
  inheritAttrs: false,
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    hideLabel: { type: Boolean, default: false },
    hideDescription: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    validation: { type: [String, Object], default: null },
    value: { type: [String, Number], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    autofocus: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    description: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
  },
  setup(props) {
    const input = getDomRef(null);
    const registerValidation = inject(registerFieldValidation, registerFieldValidationDefault);
    const fieldValidation = registerValidation(
      props.id,
      computed(() => props.value),
      {
        ...props.validation,
        required: props.required,
      },
    );

    useIntersectionObserver(input, (entries: IntersectionObserverEntry[]) => {
      if (props.autofocus) {
        entries.forEach((entry) => (entry.target as HTMLInputElement).focus());
      }
    });

    return {
      input,
      fieldValidation,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';

.vueTextarea {
  display: flex;
  flex-direction: column;

  textarea {
    outline: none !important;
    color: $textarea-color;
    font-size: $textarea-font-size;
    font-family: $textarea-font-family;
    font-weight: $textarea-font-weight;
    background: $textarea-background-color;
    border: $textarea-border;
    border-radius: $textarea-border-radius;
    padding: $textarea-padding;
    line-height: $textarea-line-height;
    height: $textarea-height;
    width: 100%;

    &:hover {
      outline: none !important;
      border: $textarea-border-hover;
    }

    &:focus {
      outline: none !important;
      box-shadow: $textarea-outline;
    }

    &:active {
      outline: none !important;
    }
  }

  textarea::placeholder {
    color: $textarea-placeholder-color;
    font-size: $textarea-font-size;
    font-family: $textarea-font-family;
    font-weight: $textarea-font-weight;
    opacity: 1;
  }

  &.error {
    textarea {
      background: $textarea-bg-error;
      border: $textarea-border-error;
    }
  }

  &.disabled {
    opacity: $textarea-disabled-disabled-opacity;
  }

  .label {
    display: flex;
    height: $textarea-label-height;
    margin-bottom: $textarea-label-gap;
  }

  .description {
    display: block;
    min-height: $textarea-description-height;
    margin-top: $textarea-description-gap;
  }
}
</style>
