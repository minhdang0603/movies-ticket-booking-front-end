export async function POST(request: Request) {
    const res = await request.json();
    const accessToken = res.accessToken as string;
    const expiryTime = res.expiryTime as string;
    if (!accessToken) {
        return Response.json({ message: 'Không nhận được access token' }, {
            status: 401
        })
    }

    const expireAt = new Date(expiryTime).toUTCString();

    return Response.json(res, {
        status: 200,
        headers: { 'Set-Cookie': `accessToken=${accessToken}; Path=/; HttpOnly; Expires=${expireAt}; SameSite=Lax; Secure` },
    });
}