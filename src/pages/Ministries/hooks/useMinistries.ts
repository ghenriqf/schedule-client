import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ministryApi } from '@/features/ministry'
import type { MinistryDetailResponse } from '@/entities/ministry/model/types'

type FilterTab = 'all' | 'ADMIN' | 'MEMBER'

export function useMinistries() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')

  const { data: ministries, isLoading, isError, refetch } = useQuery({
    queryKey: ['ministries'],
    queryFn: () => ministryApi.list(),
  })

  const filtered: MinistryDetailResponse[] = (ministries ?? []).filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || m.role === filter
    return matchesSearch && matchesFilter
  })

  return {
    ministries,
    filtered,
    isLoading,
    isError,
    refetch,
    search, setSearch,
    filter, setFilter,
    adminCount: (ministries ?? []).filter((m) => m.role === 'ADMIN').length,
    memberCount: (ministries ?? []).filter((m) => m.role === 'MEMBER').length,
    clearFilters: () => { setSearch(''); setFilter('all') },
  }
}