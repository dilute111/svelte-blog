export const CACHE_KEY = 'blog_posts';

export const TIMEOUTS = {
    CACHE_FALLBACK: 3000,   // 3 секунды до кэша
    SERVER_REQUEST: 5000,   // 5 секунд до таймаута
} as const;