import type {IPost} from "$lib/types";
import {CACHE_KEY} from "$lib/constants";

export const cacheService = {
    getPosts(): IPost[] | null {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    },

    setPosts(posts: IPost[]): void {
        localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
    },

    getPost(id: number): IPost | null {
        const posts = this.getPosts();
        return posts?.find(p => p.id === id) || null;
    }
};