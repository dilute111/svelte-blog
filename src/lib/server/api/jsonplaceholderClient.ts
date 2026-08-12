import type { FetchFunction } from "$lib/types";

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const jsonplaceholderClient = {
    getPosts: async (fetch: FetchFunction) => {
        const res = await fetch(`${BASE_URL}/posts`);
        if (!res.ok) throw new Error('Failed to fetch posts from external API');
        return res.json();
    },

    getPost: async (id: string, fetch: FetchFunction) => {
        const res = await fetch(`${BASE_URL}/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post from external API');
        return res.json();
    },
};