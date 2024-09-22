import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { auth } from '../middlewares/auth'

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: 'Remove a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            memberId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            `You're not allowed to update this member from the organization`,
          )
        }

        await prisma.member.delete({
          where: {
            organizationId: organization.id,
            id: memberId,
          },
        })

        return reply.status(204).send()
      },
    )
}
