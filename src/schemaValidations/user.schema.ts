import z from 'zod'
import { RoleType } from './common.schema'

export const AccountRes = z
  .object({
    code: z.number(),
    data: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      roles: z.array(RoleType)
    })
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256)
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>
