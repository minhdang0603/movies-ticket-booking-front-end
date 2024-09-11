import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";
import { AccountResType, UpdateMeBodyType, UserListResType, UserResType } from "@/schemaValidations/user.schema";

const accountApiRequest = {
    myInfo: (accessToken: string) => http.get<AccountResType>('/users/my-info', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    myInfoClient: () => http.get<AccountResType>('/users/my-info'),
    getAllUsers: (accessToken: string) => http.get<UserListResType>('/users', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    getUserById: (accessToken: string, userId: string) => http.get<UserResType>(`/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    updateUser: (body: UpdateMeBodyType) => http.put<AccountResType>(`/users/${body.userId}`, body),
    deleteUser: (userId: string) => http.delete<MessageResType>(`/users/${userId}`, {}),
}

export default accountApiRequest;