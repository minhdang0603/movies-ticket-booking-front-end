import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { decodeJWT, normalizePath } from "./utils";
import { redirect } from "next/navigation";
import { PayloadJWT } from "@/type";

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string
}

const AUTHENTICATION_ERROR_STATUS = 401;

export class HttpError extends Error {

    status: number;
    payload: {
        message: string,
        code: number
    }

    constructor({ status, payload }: { status: number, payload: any }) {
        super('Http error');
        this.status = status;
        this.payload = payload;
    }
}

class AccessToken {
    private token = '';
    private _expireAt = new Date().toISOString();
    get value() {
        return this.token;
    }

    set value(token: string) {
        // Nếu gọi method này ở server sẽ bị lỗi
        if (typeof window === 'undefined') {
            throw new Error('Cannot set token on server side')
        }

        this.token = token;
    }

    get expireAt() {
        return this._expireAt;
    }

    set expireAt(expireAt: string) {
        // Nếu gọi method này ở server sẽ bị lỗi
        if (typeof window === 'undefined') {
            throw new Error('Cannot set token on server side')
        }

        this._expireAt = expireAt;
    }
}

export const clientAccessToken = new AccessToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async<Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeaders = {
        'Content-Type': 'application/json',
        Authorization: clientAccessToken.value ? `Bearer ${clientAccessToken.value}` : ''
    }

    // Nếu không truyền baseUrl hoặc baseUrl = undefined thì lấy giá trị từ envConfig.NEXT_PUBLIC_API_ENDPOINT
    // Nếu truyên baseUrl thì lấy giá trị truyền vào, truyền vào '' thì gọi API đến Nextjs server
    const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers
        },
        method,
        body
    });

    const payload: Response = await res.json();

    const data = {
        status: res.status,
        payload
    }

    if (!res.ok) {
        if (res.status === AUTHENTICATION_ERROR_STATUS) {
            if (typeof window !== 'undefined') {
                if (!clientLogoutRequest) { // Xử lý tự động logout client component
                    clientLogoutRequest = fetch('/api/auth/logout', {
                        method: 'POST',
                        body: JSON.stringify({ force: true }),
                        headers: {
                            ...baseHeaders
                        }
                    });

                    await clientLogoutRequest;

                    clientAccessToken.value = '';
                    clientAccessToken.expireAt = new Date().toISOString();
                    clientLogoutRequest = null;
                    location.href = '/login';
                }
            } else { // Xử lý tự động logout server component
                const accessToken = (options?.headers as any).Authorization.split(' ')[1];
                redirect(`/logout?accessToken=${accessToken}`);
            }
        } else {
            throw new HttpError(data);
        }
    }


    //Đảm bảo logic chỉ chạy ở phía client
    if (typeof window !== 'undefined') {
        if (['auth/login', 'auth/register'].some(item => item === normalizePath(url))) {
            const res = (payload as LoginResType).data;
            clientAccessToken.value = res.token;
            const jwtPayload = decodeJWT<PayloadJWT>(clientAccessToken.value);
            clientAccessToken.expireAt = new Date(jwtPayload.exp * 1000).toISOString();

        } else if ('auth/logout' === normalizePath(url)) {
            clientAccessToken.value = '';
            clientAccessToken.expireAt = new Date().toISOString();
        }
    }

    return data;
}

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('GET', url, options);
    },
    post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('POST', url, { ...options, body });
    },
    put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('PUT', url, { ...options, body });
    },
    delete<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('DELETE', url, { ...options, body });
    },
}

export default http;