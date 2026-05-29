import { PayOS } from '@payos/node';

// Lazy initialization to ensure dotenv is loaded first
let _payOS: PayOS | null = null;

function getPayOS(): PayOS {
  if (!_payOS) {
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    if (!clientId || !apiKey || !checksumKey) {
      console.warn('[PayOS] WARNING: PayOS credentials not found in environment variables');
      console.warn('[PayOS] Payment will fall back to mock mode');
    }

    _payOS = new PayOS({
      clientId: clientId || '',
      apiKey: apiKey || '',
      checksumKey: checksumKey || '',
    });
  }
  return _payOS;
}

// Export a proxy that delegates to the lazily-initialized instance
export default {
  paymentRequests: {
    create: (body: any) => getPayOS().paymentRequests.create(body),
    get: (orderCode: string | number) => getPayOS().paymentRequests.get(Number(orderCode)),
    cancel: (orderCode: string | number, reason?: string) => getPayOS().paymentRequests.cancel(Number(orderCode), reason),
  },
  webhooks: {
    verify: (body: any) => getPayOS().webhooks.verify(body),
  },
};
