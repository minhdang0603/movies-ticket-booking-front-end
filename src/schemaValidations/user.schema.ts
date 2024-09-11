import z from 'zod'
import { Role } from './common.schema'

export const AccountRes = z
  .object({
    code: z.number(),
    data: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      roles: z.array(Role)
    })
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const UpdateMeBody = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(256),
  phone: z.string().regex(/^\d{9,10}$/, "Phone number must be 9 or 10 digits"),
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one role.",
  })
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const UserListRes = z
  .object({
    code: z.number(),
    data: z.array(
      z.object({
        userId: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        roles: z.array(Role)
      })
    )
  })
  .strict()

export type UserListResType = z.TypeOf<typeof UserListRes>

export const UserRes = z
  .object({
    code: z.number(),
    data: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      roles: z.array(Role)
    })
  })
  .strict()

export type UserResType = z.TypeOf<typeof UserRes>
