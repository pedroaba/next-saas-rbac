import { api } from './api-client'

interface CreateOrganizationRequest {
  domain: string | null
  shouldAttachUsersByDomain: boolean
  name: string
}

type CreateOrganizationResponse = void

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
