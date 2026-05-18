import { PayOS } from '@payos/node';
// Lazy initialization to ensure dotenv is loaded first
let _payOS = null;
function getPayOS() {
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
        create: (body) => getPayOS().paymentRequests.create(body),
        get: (orderCode) => getPayOS().paymentRequests.get(orderCode),
        cancel: (orderCode, reason) => getPayOS().paymentRequests.cancel(orderCode, reason),
    },
    webhooks: {
        verify: (body) => getPayOS().webhooks.verify(body),
    },
};
//# sourceMappingURL=payos.js.map