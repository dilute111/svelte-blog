import {error} from "@sveltejs/kit";
import * as postRepo from '$lib/server/repo/postRepo'
import type {FetchFunction, ICreatePost, IPost} from "$lib/types";
import {browser} from "$app/environment";

const CACHE_KEY = 'blog_posts'

export async function getPosts(fetch: FetchFunction): Promise<IPost[]> {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts')

        if (!res.ok) throw new Error('API Error')
        // Use internal repo to work with CRUD endpoints
        const data = await res.json()

        // Сохраняем в кэш
        if (browser) {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data))
            } catch {
                // localStorage unavailable
            }
        }
        postRepo.initPosts(data) // Initializing repository
        return postRepo.getPosts() // Returning from memory
    } catch (err) {
        console.log('API упал:', err);
        if (browser) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const data = JSON.parse(cached);
                    postRepo.initPosts(data);
                    return postRepo.getPosts();
                }
            } catch {
                console.error('Ошибка парсинга кэша');
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
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

    if (!res.ok) error(res.status, res.statusText)

    return res.json()
}

export async function createPost(data: ICreatePost): Promise<IPost> {
    return postRepo.createPost(data)
}