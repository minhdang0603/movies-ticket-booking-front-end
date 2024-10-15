import http from "@/lib/http";
import { RoleResType } from "@/schemaValidations/common.schema";

const roleApiRequest = {
    getAllRoles: (accessToken: string) => http.get<RoleResType>('/roles', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
}


export default roleApiRequest;