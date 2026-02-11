import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      page: () => import('./Introduction.mdx'),
    },
  },
};

export default meta;
