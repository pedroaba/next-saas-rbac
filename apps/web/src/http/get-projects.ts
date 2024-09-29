import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    name: string
    id: string
    slug: string
    avatarUrl: string | null
    createdAt: Date
    ownerId: string
    organizationId: string
    description: string
    owner: {
      name: string | null
      id: string
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(org: string) {
  const result = await api
    .get(`organizations/${org}/projects`, {
      next: {
        tags: ['projects'],
      },
    })
    .json<GetProjectsResponse>()

  return result
}
