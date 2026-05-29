import Redis from 'ioredis';

/**
 * Redis client với graceful degradation.
 * Nếu Redis không khả dụng, trả về mock client để server vẫn chạy được.
 */
function createRedisClient():
  | Redis
  | {
      publish: (channel: string, message: string) => Promise<void>;
      get: (key: string) => Promise<string | null>;
      set: (key: string, value: string) => Promise<void>;
      setex: (key: string, seconds: number, value: string) => Promise<void>;
      del: (...keys: string[]) => Promise<number>;
      keys: (pattern: string) => Promise<string[]>;
      disconnect: () => void;
      status: string;
      zrevrank: (key: string, member: string) => Promise<number | null>;
      zscore: (key: string, member: string) => Promise<string | null>;
      zincrby: (key: string, increment: number, member: string) => Promise<string>;
      zrange: (key: string, start: number, stop: number, withScores?: string) => Promise<string[]>;
      zrevrange: (key: string, start: number, stop: number, withScores?: string) => Promise<string[]>;
      zadd: (key: string, score: number, member: string) => Promise<number>;
    } {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  const mock = {
    publish: async (_channel: string, _message: string) => {},
    get: async (_key: string) => null,
    set: async (_key: string, _value: string) => {},
    setex: async (_key: string, _seconds: number, _value: string) => {},
    del: async (..._keys: string[]) => 0,
    keys: async (_pattern: string) => [],
    disconnect: () => {},
    status: 'disconnected',
    zrevrank: async (_key: string, _member: string) => null,
    zscore: async (_key: string, _member: string) => null,
    zincrby: async (_key: string, _increment: number, _member: string) => '0',
    zrange: async (_key: string, _start: number, _stop: number) => [],
    zrevrange: async (_key: string, _start: number, _stop: number) => [],
    zadd: async (_key: string, _score: number, _member: string) => 0,
  };

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 1) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      connectTimeout: 3000,
    });

    client.on('error', () => {});
    client.on('connect', () => console.log('[Redis] Connected successfully'));

    return client;
  } catch {
    return mock;
  }
}

export const redis = createRedisClient();
export default redis;
