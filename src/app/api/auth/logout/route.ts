import authApiRequest from '@/services/auth';
import { HttpError } from '@/lib/http';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const res = await request.json();
    const force = res.force as boolean | undefined;
    if (force) {
        return Response.json({
            message: 'Force logout success'
        }, {
            status: 200,
            headers: {
                // Xóa cookie session token
                'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`
            },
        });
    }
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
        return Response.json({ message: 'Không nhận được session token' }, {
            status: 401
        })
    }
    try {
        const result = await authApiRequest.logoutFromNextServerToServer({ token: accessToken.value });
        return Response.json(result.payload, {
            status: 200,
            headers: {
                // Xóa cookie session token
                'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`
            },
        });
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