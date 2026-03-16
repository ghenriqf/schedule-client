import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { repertoireApi } from '@/features/repertoire'
import { ministryApi } from '@/features/ministry'
import type { MusicResponse, MusicRequest } from '@/entities/music/model/types'

export function useRepertorio() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ministryId = Number(id)

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MusicResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MusicResponse | null>(null)

  const { data: ministry } = useQuery({
    queryKey: ['ministry', ministryId],
    queryFn: () => ministryApi.findDetails(ministryId),
    enabled: !!ministryId,
  })

  const { data: musicList = [], isLoading, isError } = useQuery<MusicResponse[]>({
    queryKey: ['musics', ministryId, search],
    queryFn: () => repertoireApi.listByMinistry(ministryId, { search }),
    enabled: !!ministryId,
  })

  const filteredList = search.trim()
    ? musicList.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.artist.toLowerCase().includes(search.toLowerCase())
      )
    : musicList

  const createMutation = useMutation({
    mutationFn: (req: MusicRequest) => repertoireApi.create(ministryId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musics', ministryId] })
      queryClient.invalidateQueries({ queryKey: ['ministry', ministryId] })
      toast.success('Música adicionada ao repertório.')
      setFormOpen(false)
    },
    onError: () => toast.error('Não foi possível adicionar a música.'),
  })

  const updateMutation = useMutation({
    mutationFn: (req: MusicRequest) => repertoireApi.update(ministryId, editTarget!.id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musics', ministryId] })
      toast.success('Música atualizada.')
      setEditTarget(null)
      setFormOpen(false)
    },
    onError: () => toast.error('Não foi possível atualizar a música.'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => repertoireApi.delete(ministryId, deleteTarget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musics', ministryId] })
      queryClient.invalidateQueries({ queryKey: ['ministry', ministryId] })
      toast.success('Música removida do repertório.')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Não foi possível remover a música.'),
  })

  return {
    ministryId,
    ministry,
    search, setSearch,
    filteredList,
    isLoading,
    isError,
    isAdmin: ministry?.role === 'ADMIN',
    formOpen,
    editTarget,
    deleteTarget,
    setDeleteTarget,
    isFormPending: createMutation.isPending || updateMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    openCreate: () => { setEditTarget(null); setFormOpen(true) },
    openEdit: (m: MusicResponse) => { setEditTarget(m); setFormOpen(true) },
    closeForm: () => { setFormOpen(false); setEditTarget(null) },
    submitForm: (data: MusicRequest) => editTarget ? updateMutation.mutate(data) : createMutation.mutate(data),
    confirmDelete: () => deleteMutation.mutate(),
    navigateToMinistry: () => navigate(`/ministries/${ministryId}`),
  }
}