import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FileDown, MoreHorizontal, Plus, Search } from 'lucide-react'
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
import useDebounce from './hook/use-debounce'
import { TagResponse } from './types'

export const App = () => {
  const [filter, setFilter] = useState('')
  const [serchParams] = useSearchParams()

  const debouncedFilter = useDebounce(filter, 1000)
  const page = serchParams.get('page') ? Number(serchParams.get('page')) : 1

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', debouncedFilter, page],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/tags?_page=${page}&_per_page=10&title=${debouncedFilter}`,
      )
      const data: TagResponse = await response.json()

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

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
          <Input variant="filter">
            <Search className="size-3" />
            <Control
              placeholder="Search tags..."
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            />
          </Input>
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
