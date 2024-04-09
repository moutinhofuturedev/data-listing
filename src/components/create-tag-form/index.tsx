import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '../ui/button'

const createTagSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  slug: z.string(),
})

type CreateTagFormData = z.infer<typeof createTagSchema>

export const CreateTagForm = () => {
  const { register, handleSubmit, watch, reset } = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
  })

  const createTag = (data: CreateTagFormData) => {
    console.log(data)

    reset()
  }

  const getSlugFromString = (string: string): string => {
    return string
      .normalize('NFD')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const slug = watch('name') ? getSlugFromString(watch('name')) : ''

  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="name">
          Tag name
        </label>
        <input
          className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm"
          type="text"
          id="name"
          {...register('name')}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm"
          type="text"
          id="slug"
          {...register('slug')}
          value={slug}
          readOnly
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="reset">
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          className="bg-teal-400 text-teal-950 transition-colors hover:bg-teal-600"
          type="submit"
        >
          <Check className="size-3" />
          Save
        </Button>
      </div>
    </form>
  )
}
