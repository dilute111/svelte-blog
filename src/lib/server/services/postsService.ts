import {error} from "@sveltejs/kit";
import * as postRepo from '$lib/server/repo/postsRepo'
import type {FetchFunction, ICreatePost, IPost, IUpdatePostData} from "$lib/types";
import {browser} from "$app/environment";
import {cacheService} from "$lib/services/cacheService";
import {jsonplaceholderClient} from "$lib/server/api/jsonplaceholderClient";

export async function getPosts(fetch: FetchFunction): Promise<IPost[]> {
    try {
        const data = await jsonplaceholderClient.getPosts(fetch);

        // Сохраняем в кэш
        if (browser) {
                cacheService.setPosts(data)
        }
        postRepo.initPosts(data) // Initializing repository
        return postRepo.getPosts() // Returning from memory
    } catch (err) {
        console.log('API упал:', err);
        if (browser) {
                const cached = cacheService.getPosts();
                if (cached) {
                    postRepo.initPosts(cached);
                    return postRepo.getPosts();
                }
        }
        return [];
    }
}

export async function getPost(id: string, fetch: FetchFunction): Promise<IPost> {
    // At first try to find in local repository
    const local = postRepo.getPost(Number(id))
    if (local) return local
    // If not found - find in external API
    return jsonplaceholderClient.getPost(id, fetch);
}

export async function createPost(data: ICreatePost): Promise<IPost> {
    return postRepo.createPost(data)
}

export async function updatePost( id: number, data: IUpdatePostData ): Promise<IPost> {
    const updated = postRepo.updatePost(id, data)
    if (!updated) error(404, 'Post not found')
    return updated
}

export async function deletePost( id: number ): Promise<void> {
    const deleted = postRepo.deletePost(id)
    if (!deleted) error(404, 'Post not found')
    return
}