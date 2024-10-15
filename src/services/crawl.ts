import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";

const crawlApiRequest = {
    crawl: (type: string, crawDate?: number) => http.post<MessageResType>(
        `/crawl?type=${type}${crawDate ? `&crawDate=${crawDate}` : ''}`,
        {}
    )
}

export default crawlApiRequest;