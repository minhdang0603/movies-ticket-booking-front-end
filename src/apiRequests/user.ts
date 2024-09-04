import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/user.schema";

const accountApiRequest = {
    myInfo: (accessToken: string) => http.get<AccountResType>('/users/my-info', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    myInfoClient: () => http.get<AccountResType>('/users/my-info')
}

export default accountApiRequest;