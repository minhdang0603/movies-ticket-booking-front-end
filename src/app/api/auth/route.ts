import { decodeJWT } from "@/lib/utils";
import { PayloadJWT } from "@/type";

export async function POST(request: Request) {
    const res = await request.json();
    const accessToken = res.accessToken as string;
    if (!accessToken) {
        return Response.json({ message: 'Không nhận được access token' }, {
            status: 401
        })
    }
    const payload = decodeJWT<PayloadJWT>(accessToken);
    const expireAt = new Date(payload.exp * 1000).toUTCString();

    return Response.json(res, {
        status: 200,
        headers: { 'Set-Cookie': `accessToken=${accessToken}; Path=/; HttpOnly; Expires=${expireAt}; SameSite=Lax; Secure` },
    });
}