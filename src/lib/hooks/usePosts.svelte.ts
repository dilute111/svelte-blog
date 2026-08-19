// usePosts.svelte.ts
import type { IPost, IPostResponse } from "$lib/types";
import { invalidate } from "$app/navigation";
import {cacheService} from "$lib/services/cacheService";
import {INTERNAL_ROUTES} from "$lib/config/routes";

export class PostsStore {
    postsDataOrCachedPosts = $state<IPost[] | null>(null);
    isFromCache = $state(false);
    isLoading = $state(true);
    private postsPromise: Promise<{ posts: IPost[] }>;

    addPostOptimistically = (postData: { title: string; body: string }) => {
        const newPost: IPost = {
            id: Date.now(),
            title: postData.title,
            body: postData.body,
            userId: 1,
            createdAt: new Date().toISOString()
        };

        const currentPosts = this.postsDataOrCachedPosts || [];

        this.postsDataOrCachedPosts = [...currentPosts, newPost];

        cacheService.setPosts(this.postsDataOrCachedPosts)

        return newPost;
    };

    updatePostOptimistically = (id: number, data: { title?: string; body?: string }) => {
        const currentPosts = this.postsDataOrCachedPosts || []
        const index = currentPosts.findIndex(p => p.id === id)
        if (index === -1) return null

        const updatedPost = { ...currentPosts[index], ...data }
        const newPosts = [...currentPosts]
        newPosts[index] = updatedPost

        this.postsDataOrCachedPosts = newPosts
        cacheService.setPosts(newPosts)

        return updatedPost
    }

    updatePostOnServer = async (id: number, data: { title: string; body: string }) => {
        const res = await fetch(`${INTERNAL_ROUTES.post(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message || 'Failed to update post')
        }

        return await res.json()
    }

    constructor(postsPromise: Promise<{ posts: IPost[] }>) {
        this.postsPromise = postsPromise;
    }

    deletePostOptimistically = (id: number) => {
        const currentPosts = this.postsDataOrCachedPosts || []
        const filteredPosts = currentPosts.filter(p => p.id !== id)

        this.postsDataOrCachedPosts = filteredPosts
        cacheService.setPosts(filteredPosts)
    }

    deletePostOnServer = async (id: number) => {
        const res = await fetch(`${INTERNAL_ROUTES.post(id)}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message || 'Failed to delete post')
        }
        return true
    }

    private updatePosts = (result: IPostResponse, keepOptimistic?: boolean) => {
        if (result.posts.length > 0) {
            cacheService.setPosts(result.posts)

            if (keepOptimistic && this.postsDataOrCachedPosts && this.postsDataOrCachedPosts.length > 0) {
                if (result.posts.length > this.postsDataOrCachedPosts.length) {
                    this.postsDataOrCachedPosts = result.posts;
                } else {
                    // Сохраняем оптимистичные данные в localStorage
                    cacheService.setPosts(this.postsDataOrCachedPosts)
                    this.isLoading = false;
                    return;
                }
            } else {
                this.postsDataOrCachedPosts = result.posts;
            }
            this.isFromCache = false;
            this.isLoading = false;
        } else if (!keepOptimistic) {
            this.loadFromCache();
        }
    };

    getPost = (id: number): IPost | null => {
        const post = this.postsDataOrCachedPosts?.find(p => p.id === id);
        if (post) return post;

        return cacheService.getPost(id);
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
        const parsed = cacheService.getPosts()

        if (parsed) {
            try {
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