import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscription',
    {
      schema: {
        summary: 'Create a new subscription',
        //description: "Create a new subscription", if you want to add a text longer
        tags: ['Subscription'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          referrer: z.string().nullish(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, referrer } = request.body
      const { subscriberId } = await subscribeToEvent({
        name,
        email,
        referrerId: referrer ?? null,
      })
      return reply.status(201).send({
        subscriberId,
      }) //return custom status
    }
  )
}
