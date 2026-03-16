import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ministryApi } from '@/features/ministry'
import type { MinistryRequest } from '@/entities/ministry/model/types'

export function useCreateMinistry() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarImage) return null
    return URL.createObjectURL(avatarImage)
  }, [avatarImage])

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const request: MinistryRequest = {
        name: name.trim(),
        description: description.trim(),
      }
      return ministryApi.create(request, avatarImage)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ministries'] })
      setSubmitted(true)
    },
    onError: () => {
      toast.error('Não foi possível criar o ministério. Tente novamente.')
    },
  })

  return {
    step, setStep,
    name, setName,
    description, setDescription,
    avatarImage, setAvatarImage,
    avatarPreviewUrl,
    submitted,
    isPending,
    canGoNext: name.trim().length >= 2,
    canSubmit: name.trim().length >= 2 && !isPending,
    mutate,
    navigateBack: () => navigate('/ministries'),
  }
}