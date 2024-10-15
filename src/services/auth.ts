import http from "@/lib/http";
import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
    login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
    register: (body: RegisterBodyType) => http.post<RegisterResType>('/users', body),
    auth: (body: { accessToken: string, expiryTime: string }) => http.post('/api/auth', body, {
        baseUrl: ''
    }),
    logoutFromNextServerToServer: (body: { token: string }) => http.post<MessageResType>('/auth/logout', body),
    logoutFromNextClientToNextServer: (force?: boolean | undefined) => http.post<MessageResType>('/api/auth/logout', { force }, {
        baseUrl: ''
    }),
    refreshTokenFromNextServerToServer: (body: { token: string }) => http.post<LoginResType>('/auth/refresh', body),
    refreshTokenFromNextClientToNextServer: () => http.post<LoginResType>('/api/auth/refresh-token', {}, {
        baseUrl: ''
    })
}

export default authApiRequest