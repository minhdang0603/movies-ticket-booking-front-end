import z from 'zod'

export const MessageRes = z
  .object({
    code: z.number(),
    message: z.string()
  })
  .strict()

export type MessageResType = z.TypeOf<typeof MessageRes>

export const Role = z.object({
  name: z.string(),
  description: z.string(),
});

export type RoleType = z.TypeOf<typeof Role>;

export const RoleRes = z.object({
  code: z.number(),
  data: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  )
});

export type RoleResType = z.TypeOf<typeof RoleRes>;

