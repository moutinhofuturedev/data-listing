import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'
import { Button } from '@/components/ui/button'
import { Control, Input } from '@/components/ui/input'

import { Pagination } from './components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { env } from './env'
import { TagResponse } from './types'

export const App = () => {
  const [serchParams, setSearchParams] = useSearchParams()
  const page = serchParams.get('page') ? Number(serchParams.get('page')) : 1
  const urlFilter = serchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(urlFilter)

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', urlFilter, page],
    queryFn: async () => {
      const response = await fetch(
        `${env.VITE_API_URL}/tags?_page=${page}&_per_page=10&title=${urlFilter}`,
      )
      const data: TagResponse = await response.json()

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return data
    },
    placeholderData: keepPreviousData, // evitar que a página pisque ao fazer requisições
    staleTime: 1000 * 60 * 5,
    /* 1000 x 60 x 5 calcula o tempo em milissegundos, equivalente a 5 minutos. Portanto, após 5 minutos desde a última busca bem-sucedida
    os dados serão considerados obsoletos, e o React Query tentará buscar os dados mais recentes
    */
  })

  const handleFilter = () => {
    setSearchParams((params) => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="space-y-8 py-10">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="mx-auto max-w-6xl space-y-5">
        <div className="items-cente flex gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant="primary">
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
              />
            </Input>
            <Button variant="primary" onClick={handleFilter}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>
          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data.map((tags) => {
              return (
                <TableRow key={tags.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tags.title}</span>
                      <span className="text-xs text-zinc-500">{tags.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tags.amountVideos} video(s)
                  </TableCell>
                  <TableCell>
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tagsResponse && (
          <Pagination
            items={tagsResponse?.items}
            page={page}
            pages={tagsResponse?.pages}
          />
        )}
      </main>
    </div>
  )
}
