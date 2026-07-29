// usePosts.svelte.ts
import type { IBlogPageData, IPost, IPostResponse } from "$lib/types";
import { logout } from "$lib/shared/auth";
import { invalidate } from "$app/navigation";

const CACHE_KEY = 'blog_posts';

export class PostsStore {
    postsDataOrCachedPosts = $state<IPost[] | null>(null);
    isFromCache = $state(false);
    isLoading = $state(true);
    private data: IBlogPageData;

    constructor(data: IBlogPageData) {
        this.data = data;
    }

    private validationPostsLength = (result: IPostResponse) => {
        if (result.posts.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(result.posts));
            this.postsDataOrCachedPosts = result.posts;
            this.isFromCache = false;
            this.isLoading = false;
        } else {
            this.loadFromCache();
        }
    };

    loadPosts = async () => {

        try {
            const result = await this.data.posts;

            if (result?.shouldLogout) {
                logout();
                return;
            }
            this.validationPostsLength(result);
        } catch {
            this.loadFromCache();
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

    refreshPosts = async () => {
        await invalidate('app:auth');
        this.isLoading = true;
        await this.loadPosts();
    };
}

export const usePostsSvelte = (data: IBlogPageData) => {
    return new PostsStore(data);
};