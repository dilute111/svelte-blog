// usePosts.svelte.ts
import type {IBlogPageData, IPost, IPostResponse} from "$lib/types";
import {invalidate} from "$app/navigation";

const CACHE_KEY = 'blog_posts';

export class PostsStore {
    postsDataOrCachedPosts = $state<IPost[] | null>(null);
    isFromCache = $state(false);
    isLoading = $state(true);
    private postsPromise: Promise<{ posts: IPost[] }>;

    constructor(postsPromise: Promise<{ posts: IPost[] }>) {
        this.postsPromise = postsPromise;
    }

    private updatePosts = (result: IPostResponse, keepOptimistic?: boolean) => {
        if (result.posts.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(result.posts));
            this.postsDataOrCachedPosts = result.posts;
            this.isFromCache = false;
            this.isLoading = false;
        } else if(!keepOptimistic) {
            this.loadFromCache();
        }
    };

    getPost = (id: number): IPost | null => {
        // Сначала ищем в текущих данных
        const post = this.postsDataOrCachedPosts?.find(p => p.id === id);
        if (post) return post;

        // Если нет - пробуем из кэша
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return parsed.find((p: IPost) => p.id === id) || null;
            } catch {
                return null;
            }
        }
        return null;
    };


    loadPosts = async (keepOptimistic = false) => {

        try {
            const result = await this.postsPromise;
            this.updatePosts(result, keepOptimistic);
        } catch {
            if (keepOptimistic) {
                this.isLoading = false;
            } else {
                this.loadFromCache();
            }
        }
    };

    loadFromCache = () => {
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                this.postsDataOrCachedPosts = parsed;
                this.isFromCache = true;
            } catch {
                this.postsDataOrCachedPosts = [];
                this.isFromCache = false;
            }
        } else {
            this.postsDataOrCachedPosts = [];
            this.isFromCache = false;
        }
        this.isLoading = false;
    };

    refreshPosts = async (keepOptimistic = false) => {
        await invalidate('app:auth');
        this.isLoading = true;
        await this.loadPosts(keepOptimistic);
    };
}

export const usePostsSvelte = (postsPromise: Promise<{ posts: IPost[] }>) => {
    return new PostsStore(postsPromise);
};