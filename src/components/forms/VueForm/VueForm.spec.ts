import { render, RenderResult } from '@testing-library/vue';
import VueForm from './VueForm.vue';

describe('VueForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(VueForm, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('VueForm');
  });
});
