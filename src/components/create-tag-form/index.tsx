import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { api } from '@/libs/axios'

import { getSlugFromString } from './rules/get-slug-from-string'

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  amountVideos: z
    .string()
    .min(1, { message: 'Amount must be at least 1 number' }),
})

type CreateTagFormData = z.infer<typeof createTagSchema>

export const CreateTagForm = () => {
  const queryClient = useQueryClient()
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

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, amountVideos }: CreateTagFormData) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const postTag = await api.post('/tags', {
          title,
          slug,
          amountVideos: Number(amountVideos),
        })

        toast.success('Tag created!', {
          style: {
            background: '#2dd4bf',
            color: '#042f2e',
            borderColor: '#042f2e',
          },
        })

        reset()
        return postTag
      } catch {
        toast.error('Failed to create tag', {
          position: 'bottom-left',
          style: {
            background: '#2dd4bf',
            color: '#042f2e',
            borderColor: '#042f2e',
          },
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-tags'] })
      /* Este trecho de código define uma função onSuccess que invalida a consulta 'get-tags' no objeto queryClient. 
      Isso significa que a consulta 'get-tags' será invalidada automaticamente após o sucesso da requisição,
      e o React Query tentará buscar os dados mais recentes.
      */
    },
  })

  const createNewTag = async ({ title, amountVideos }: CreateTagFormData) => {
    const postTag = await mutateAsync({ title, amountVideos })

    return postTag
  }

  return (
    <form onSubmit={handleSubmit(createNewTag)} className="w-full space-y-6">
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

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="amountVideos">
          Number of videos
        </label>
        <input
          className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm"
          type="text"
          id="amountVideos"
          {...register('amountVideos')}
        />
        {errors.amountVideos && (
          <p className="text-sm text-red-500">{errors.amountVideos.message}</p>
        )}
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
