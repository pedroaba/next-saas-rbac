'use server'

import { type Role, roleSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

const inviteSchema = z.object({
  email: z.string().email({
    message: 'Invalid e-mail address.',
  }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const currentOrg = getCurrentOrg()
  const result = inviteSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, role } = result.data
  try {
    await createInvite({
      org: getCurrentOrg()!,
      email,
      role,
    })

    revalidateTag(`${currentOrg!}/invites`)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully create the invite.',
    errors: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrg()

  await removeMember({
    memberId,
    org: currentOrg!,
  })

  revalidateTag(`${currentOrg!}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = getCurrentOrg()

  await updateMember({
    memberId,
    org: currentOrg!,
    role,
  })

  revalidateTag(`${currentOrg!}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrg()

  await revokeInvite({
    inviteId,
    org: currentOrg!,
  })

  revalidateTag(`${currentOrg!}/invites`)
}
