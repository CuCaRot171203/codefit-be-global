declare const _default: {
    paymentRequests: {
        create: (body: any) => Promise<import("@payos/node").CreatePaymentLinkResponse>;
        get: (orderCode: string | number) => Promise<import("@payos/node").PaymentLink>;
        cancel: (orderCode: string | number, reason?: string) => Promise<import("@payos/node").PaymentLink>;
    };
    webhooks: {
        verify: (body: any) => Promise<import("@payos/node").WebhookData>;
    };
};
export default _default;
//# sourceMappingURL=payos.d.ts.map