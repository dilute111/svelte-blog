import {error} from "@sveltejs/kit";
import * as postRepo from '$lib/server/repo/postsRepo'
import type {FetchFunction, ICreatePost, IPost, IUpdatePostData} from "$lib/types";
import {jsonplaceholderClient} from "$lib/server/api/jsonplaceholderClient";

export async function getPosts(fetch: FetchFunction): Promise<IPost[]> {
    const posts = await postRepo.getPosts();

    // Если база пустая - заполняем из API (первый запуск)
    if (posts.length === 0) {
        try {
            const data = await jsonplaceholderClient.getPosts(fetch);
            await postRepo.initPosts(data);
            return postRepo.getPosts();
        } catch {
            return [];

        }
    }
    return posts;
}

export async function getPost(id: string, fetch: FetchFunction): Promise<IPost> {
    // At first try to find in local repository
    const local = await postRepo.getPost(Number(id))
    if (local) return local
    // If not found - find in external API
    return jsonplaceholderClient.getPost(id, fetch);
}

export async function createPost(data: ICreatePost): Promise<IPost> {
    return postRepo.createPost(data)
}

export async function updatePost( id: number, data: IUpdatePostData ): Promise<IPost> {
    const updated = await postRepo.updatePost(id, data)
    if (!updated) error(404, 'Post not found')
    return updated
}

export async function deletePost( id: number ): Promise<void> {
    const deleted = postRepo.deletePost(id)
    if (!deleted) error(404, 'Post not found')
    return
}