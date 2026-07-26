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
        console.log('API успешно загружен, сохраняем в кэш');

        // Сохраняем в кэш
        if (browser) {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data))
                console.log('Кэш сохранён');
            } catch {
                // localStorage unavailable
            }
        }
        postRepo.initPosts(data) // Initializing repository
        return postRepo.getPosts() // Returning from memory
    } catch (err){
        console.log(' API упал:', err);
        console.log('Пытаемся достать из кэша...');

        if (browser) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    console.log('✅ Кэш найден, парсим...');
                    const data = JSON.parse(cached);
                    postRepo.initPosts(data);
                    return postRepo.getPosts();
                } else {
                    console.log('❌ Кэш не найден');
                }
            } catch {
                console.log('❌ Ошибка парсинга кэша');
            }
        } else {
            console.log('❌ Не браузер, кэш недоступен');
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