import type { Meta, StoryObj } from '@storybook/vue3'
import Ruler from '../components/index.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/vue3-sketch-ruler',
  component: Ruler,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    // name: { control: 'select', options: keyList },
    // fadeIn: { control: 'select', options: ['full', 'half', 'quarter'] },
  },
  args: {
    scaleFigure: 1,
    wdpRatio: 1,
    thick: 24,
    width: 500,
    height: 400,
    startX: 0,
    startY: 0,
    rect: {
      x: 200,
      y: 100,
      width: 200,
      height: 400,
    },
    // color: '#63cded',
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  },
} satisfies Meta<typeof Ruler>

export default meta

// ------------
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Package: Story = {
  // 默认参数
  args: {
    // color: 'red',
    // name: 'loadbar',
    // fadeIn: 'full',
    // noFadeIn: false,
    scaleFigure: 1,
    wdpRatio: 1,
  },
}
