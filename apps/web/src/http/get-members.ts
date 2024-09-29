import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetMembersResponse = {
  members: {
    name: string | null
    id: string
    avatarUrl: string | null
    role: Role
    userId: string
    email: string
  }[]
}

export async function getMembers(org: string) {
  return await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMembersResponse>()
}
