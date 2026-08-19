export const EXTERNAL_ROUTES = {
    posts: '/posts',
    post: (id: string) => `/posts/${id}`,
};

export const INTERNAL_ROUTES = {
    posts: '/api/posts',
    post: (id: number | string) => `/api/posts/${id}`,
};