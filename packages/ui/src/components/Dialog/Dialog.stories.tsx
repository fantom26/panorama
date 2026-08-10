import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/components/Button'
import Dialog from '@/components/Dialog'

const meta = {
  component: Dialog.Root,
  title: 'Dialog'
} satisfies Meta<typeof Dialog.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant='contained' />}>+ Add to Compare</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Close aria-label='Close'>×</Dialog.Close>
          <Dialog.Title>Add country to compare</Dialog.Title>
          <Dialog.Description>Search and select a country to add to the comparison. Up to 5 countries.</Dialog.Description>
          <Dialog.Close render={<Button variant='outlined' />}>Cancel</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
