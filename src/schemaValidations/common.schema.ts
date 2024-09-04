import z from 'zod'

export const MessageRes = z
  .object({
    code: z.number(),
    message: z.string()
  })
  .strict()


export const RoleType = z.object({
  name: z.string(),
  description: z.string(),
});

export type MessageResType = z.TypeOf<typeof MessageRes>
