import authApiRequest from "@/services/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
        return Response.json({ message: 'Không nhận được access token' }, {
            status: 401
        })
    }

    try {
        const res = await authApiRequest.refreshTokenFromNextServerToServer({ token: accessToken.value });
        const newAccessToken = res.payload.data.token;
        const newExpireAt = new Date(res.payload.data.expiryTime).toUTCString();

        return Response.json(res.payload, {
            status: 200,
            headers: { 'Set-Cookie': `accessToken=${newAccessToken}; Path=/; HttpOnly; Expires=${newExpireAt}; SameSite=Lax; Secure` },
        })
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status
            })
        } else {
            return Response.json(
                {
                    message: 'Lỗi không xác định'
                },
                {
                    status: 500
                }
            )
        }
    }
}