import z from 'zod'
import { Role } from './common.schema'

export const RegisterBody = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters").max(256),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must contain at least 8 character").max(100),
    confirmPassword: z.string().min(8, "Confirm password must contain at least 8 character").max(100),
    phone: z.string().regex(/^\d{9,10}$/, "Phone number must be 9 or 10 digits")
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const LoginRes = z.object({
  code: z.number(),
  data: z.object({
    token: z.string(),
    expiryTime: z.string()
  })
})

export const RegisterRes = z.object({
  code: z.number(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    roles: z.array(Role)
  })
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must contain at least 8 character").max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export type LoginResType = z.TypeOf<typeof LoginRes>
