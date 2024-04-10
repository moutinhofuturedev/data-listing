import * as Dialog from '@radix-ui/react-dialog'
import { Plus } from 'lucide-react'

import { CreateTagForm } from '@/components/create-tag-form'
import { Button } from '@/components/ui/button'

export const DialogModal = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="primary">
          <Plus className="size-3" />
          Create new
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed bottom-0 right-0 top-0 h-screen min-w-[320px] space-y-10 rounded-2xl border-l border-zinc-900 bg-zinc-950 p-10">
          <div className="flex flex-col gap-3">
            <Dialog.Title className="text-xl font-bold">
              Create new tag
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-500">
              Tags can be used to group videos about similiar concepts
            </Dialog.Description>
          </div>

          <CreateTagForm />
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
