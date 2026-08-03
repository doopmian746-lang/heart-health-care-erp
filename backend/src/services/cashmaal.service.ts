import { env } from '../config/env.js';

const CASHMAAL_PAY_URL = 'https://cmaal.com/Pay/';
const CASHMAAL_VERIFY_URL = 'https://api.cmaal.com/verify_v2';

export interface CashMaalInitiateParams {
  amount: number;
  currency: 'PKR' | 'USD';
  email: string;
  orderId: string;
  additionalInfo?: string;
  payMethod?: string;
}

export interface CashMaalVerifyResponse {
  status: string;
  receiver_account: string;
  USD_amount: string;
  fee_in_USD: string;
  PKR_amount: string;
  fee_in_PKR: string;
  USD_amount_with_fee: string;
  PKR_amount_with_fee: string;
  trx_website: string;
  transaction_id: string;
  trx_date: string;
  order_id: string;
  addi_info: string;
  sender_details: string;
  trx_details: string;
  currency?: string;
}

export const cashMaalService = {
  initiatePayment(params: CashMaalInitiateParams): string {
    const successUrl = `${env.BACKEND_URL}/api/donations/verify`;
    const cancelUrl = `${env.SITE_URL}/donate`;

    const formData = new URLSearchParams();
    formData.append('pay_method', params.payMethod || '');
    formData.append('amount', params.amount.toString());
    formData.append('currency', params.currency);
    formData.append('succes_url', successUrl);
    formData.append('cancel_url', cancelUrl);
    formData.append('client_email', params.email);
    formData.append('web_id', env.CASHMAAL_WEB_ID);
    formData.append('order_id', params.orderId);
    formData.append('addi_info', params.additionalInfo || '');

    return `${CASHMAAL_PAY_URL}?${formData.toString()}`;
  },

  buildRedirectHtml(params: CashMaalInitiateParams): string {
    const successUrl = `${env.BACKEND_URL}/api/donations/verify`;
    const cancelUrl = `${env.SITE_URL}/donate`;

    return `<!DOCTYPE html>
<html>
<head><title>Redirecting to Payment...</title></head>
<body>
<form id="cashmaal-form" action="${CASHMAAL_PAY_URL}" method="POST">
  <input type="hidden" name="pay_method" value="${params.payMethod || ''}" />
  <input type="hidden" name="amount" value="${params.amount}" />
  <input type="hidden" name="currency" value="${params.currency}" />
  <input type="hidden" name="succes_url" value="${successUrl}" />
  <input type="hidden" name="cancel_url" value="${cancelUrl}" />
  <input type="hidden" name="client_email" value="${params.email}" />
  <input type="hidden" name="web_id" value="${env.CASHMAAL_WEB_ID}" />
  <input type="hidden" name="order_id" value="${params.orderId}" />
  <input type="hidden" name="addi_info" value="${params.additionalInfo || ''}" />
  <noscript><button type="submit">Click here to pay</button></noscript>
</form>
<script>document.getElementById('cashmaal-form').submit();</script>
</body>
</html>`;
  },

  async verifyTransaction(transactionId: string): Promise<CashMaalVerifyResponse | null> {
    try {
      const url = `${CASHMAAL_VERIFY_URL}?CM_TID=${encodeURIComponent(transactionId)}&web_id=${encodeURIComponent(env.CASHMAAL_WEB_ID)}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data as CashMaalVerifyResponse;
    } catch {
      return null;
    }
  },
};
