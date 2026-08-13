import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/components/Button'
import Drawer, { type DrawerAnchor } from '@/components/Drawer'
import Icon from '@/components/Icon'
import Typography from '@/components/Typography'

function DrawerDemo({ anchor = 'right' }: { anchor?: DrawerAnchor }) {
  return (
    <Drawer.Root anchor={anchor}>
      <Drawer.Trigger render={<Button variant='contained' />}>
        <Icon name='plus' />
        Open drawer
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <div>
                <Typography variant='meta-sm' color='subtle'>
                  Compare
                </Typography>
                <Drawer.Title>Selected</Drawer.Title>
              </div>
              <Drawer.Close aria-label='Close drawer' />
            </Drawer.Header>
            <Drawer.Content style={{ padding: 16 }}>
              <Typography variant='body-sm'>Germany — GDP $4.5T</Typography>
              <Typography variant='body-sm'>France — GDP $3.0T</Typography>
            </Drawer.Content>
            <Drawer.Footer>
              <Button variant='contained' style={{ flex: 1 }}>
                Apply
              </Button>
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

const meta = {
  component: Drawer.Root,
  title: 'Overlays/Drawer',
  argTypes: {
    anchor: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right']
    }
  },
  args: {
    anchor: 'right'
  },
  render: (args) => <DrawerDemo anchor={args.anchor} />
} satisfies Meta<typeof Drawer.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
