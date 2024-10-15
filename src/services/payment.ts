import http from "@/lib/http";
import { PaymentCreationReqType, PaymnetResType } from "@/schemaValidations/payment.schema";

const paymentApiRequest = {
    createPaymentClient: (body: PaymentCreationReqType) => http.post<PaymnetResType>('/payment', body),
}

export default paymentApiRequest;