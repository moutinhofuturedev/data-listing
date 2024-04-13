import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { api } from '@/libs/axios'

import { getSlugFromString } from './rules/get-slug-from-string'

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Name must be at least 3 characters' }),
})

type CreateTagFormData = z.infer<typeof createTagSchema>

export const CreateTagForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
  })

  const slug = watch('title') ? getSlugFromString.execute(watch('title')) : ''

  const createTag = async ({ title }: CreateTagFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const postTag = await api.post('/tags', { title, slug, amountVideos: 0 })

    toast.success('Tag created!', {
      style: {
        background: '#2dd4bf',
        color: '#042f2e',
        borderColor: '#042f2e',
      },
    })

    reset()
    return postTag
  }

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
          {...register('title')}
        />

        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm"
          type="text"
          id="slug"
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
          disabled={isSubmitting}
          className="bg-teal-400 text-teal-950 transition-colors hover:bg-teal-600"
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  )
}
