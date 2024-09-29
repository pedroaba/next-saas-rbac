import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
  teste,
}: Readonly<{
  children: React.ReactNode
  teste: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-4 py-4">
      <main className="mx-auto w-full max-w-[1200px]">
        {children}
        {teste}
      </main>
    </div>
  )
}
