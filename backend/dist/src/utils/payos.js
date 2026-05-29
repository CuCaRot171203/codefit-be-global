"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@payos/node");
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
        _payOS = new node_1.PayOS({
            clientId: clientId || '',
            apiKey: apiKey || '',
            checksumKey: checksumKey || '',
        });
    }
    return _payOS;
}
// Export a proxy that delegates to the lazily-initialized instance
exports.default = {
    paymentRequests: {
        create: (body) => getPayOS().paymentRequests.create(body),
        get: (orderCode) => getPayOS().paymentRequests.get(Number(orderCode)),
        cancel: (orderCode, reason) => getPayOS().paymentRequests.cancel(Number(orderCode), reason),
    },
    webhooks: {
        verify: (body) => getPayOS().webhooks.verify(body),
    },
};
//# sourceMappingURL=payos.js.map