import { Header } from '@/components/header'

import { OrganizationForm } from './organization-form'

export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <Header />
      <h1 className="text-2xl font-bold">Create Organization</h1>

      <OrganizationForm />
    </div>
  )
}
