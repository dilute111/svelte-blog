import type { FetchFunction } from "$lib/types";
import {EXTERNAL_ROUTES} from "$lib/config/routes";

const BASE_URL = import.meta.env.VITE_JSONPLACEHOLDER_API;

export const jsonplaceholderClient = {
    getPosts: async (fetch: FetchFunction) => {
        const res = await fetch(`${BASE_URL}${EXTERNAL_ROUTES.posts}`);
        if (!res.ok) throw new Error('Failed to fetch posts from external API');
        return res.json();
    },

    getPost: async (id: string, fetch: FetchFunction) => {
        const res = await fetch(`${BASE_URL}${EXTERNAL_ROUTES.post(id)}`);
        if (!res.ok) throw new Error('Failed to fetch post from external API');
        return res.json();
    },
};