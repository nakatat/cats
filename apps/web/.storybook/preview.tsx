import type { Preview } from '@storybook/nextjs-vite';

import '../src/app/globals.css';

const storybookFontStyle = {
  '--font-noto-sans-jp':
    '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif',
  fontFamily:
    '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif',
} as const;

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    layout: 'centered',
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f7f8f9' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        className="bg-background text-foreground font-sans antialiased"
        style={storybookFontStyle}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
