import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/acces-invite-link'
import { redis } from '../redis/client'

export const accesInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'access invite link and redirects user',
        tags: ['Referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params

      await accessInviteLink({ subscriberId })
      console.log(await redis.hgetall('referral:acces-count'))

      const redirect_uri = new URL(env.WEB_URL)

      //301 redirect permanently
      //302 redirect temporarily

      redirect_uri.searchParams.set('referrer', subscriberId)
      return reply.redirect(redirect_uri.toString(), 302)
    }
  )
}
