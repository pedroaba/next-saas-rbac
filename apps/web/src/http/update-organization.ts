import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  name: string
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
