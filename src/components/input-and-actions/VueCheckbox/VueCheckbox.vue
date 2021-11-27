<template>
  <div
    :class="[$style.checkbox, disabled && $style.disabled]"
    :tabindex="disabled ? null : 0"
    @click.stop.prevent="onClick"
    @keypress.space.stop.prevent="onClick"
  >
    <div :class="$style.wrapper">
      <input
        :id="id"
        :name="name"
        type="checkbox"
        :checked="checked"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        :value="checked"
        tabindex="-1"
      />
      <div :class="$style.checkmark">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8">
          <path
            d="M9.207.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L3.5 5.086 7.793.793a1 1 0 011.414 0z"
            fill="currentColor"
          />
        </svg>
      </div>
      <vue-text
        :for="id"
        as="label"
        weight="semi-bold"
        color="text-medium"
        tabindex="-1"
        :class="hideLabel && 'sr-only'"
        v-html="label"
      />
    </div>
    <vue-text v-if="description" :class="$style.description" as="div">
      {{ description }}
    </vue-text>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@vue/composition-api';
import {
  registerFieldValidation,
  registerFieldValidationDefault,
} from '@/components/forms/VueForm/register-field-validation';
import VueText from '@/components/typography/VueText/VueText.vue';

export default defineComponent({
  name: 'VueCheckbox',
  components: { VueText },
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'click',
  },
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    hideLabel: { type: Boolean, default: false },
    description: { type: String, default: null },
    required: { type: Boolean, default: false },
    validation: { type: [String, Object], default: null }, // TODO: needs fine tuning
    disabled: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const registerValidation = inject(registerFieldValidation, registerFieldValidationDefault);
    const fieldValidation = registerValidation(
      props.id,
      computed(() => props.checked),
      {
        ...props.validation,
        required: props.required,
      },
      true,
    );

    const onClick = (e: Event) => {
      e.preventDefault();

      if (!props.disabled) {
        emit('click', !props.checked);
      }
    };

    return {
      onClick,
      fieldValidation,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';
.checkbox {
  display: inline-block;
  position: relative;
  cursor: pointer;
  user-select: none;
  outline: none;

  .wrapper {
    display: inline-flex;
    align-items: center;
  }

  .description {
    padding-left: $checkbox-checkmark-size + $checkbox-label-gap;
    line-height: $space-20;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkmark {
      background-color: $checkbox-checkmark-bg-checked !important;
      border: $checkbox-checkmark-border-checked !important;
      color: $checkbox-checkmark-color !important;
    }

    &:checked ~ .checkmark > svg {
      display: block;
    }
  }

  .checkmark {
    height: $checkbox-checkmark-size;
    width: $checkbox-checkmark-size;
    background-color: $checkbox-checkmark-bg;
    color: $checkbox-checkmark-bg;
    border-radius: $checkbox-checkmark-border-radius;
    border: $checkbox-checkmark-border;
    display: flex;
    justify-content: center;
    align-items: center;

    > svg {
      width: $checkbox-checkmark-size - ($space-4 + $space-2);
      height: $checkbox-checkmark-size - ($space-4 + $space-2);
    }
  }

  label {
    cursor: pointer;
    padding-left: $checkbox-label-gap;
  }

  &:hover {
    input ~ .checkmark {
      background-color: $checkbox-checkmark-bg-hover;
      border: $checkbox-checkmark-border-hover;
    }
  }

  &:focus {
    .checkmark {
      box-shadow: $checkbox-checkmark-outline;
    }
  }

  &.disabled {
    opacity: $checkbox-disabled-disabled-opacity;
  }
}
</style>
