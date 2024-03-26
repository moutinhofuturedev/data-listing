import { FileDown, Plus, Search } from 'lucide-react'

import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'
import { Button } from '@/components/ui/button'
import { Control, Input } from '@/components/ui/input'

export const App = () => {
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
            <Control placeholder="Search tags..." />
          </Input>
          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>
      </main>
    </div>
  )
}
