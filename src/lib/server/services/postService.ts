import {error} from "@sveltejs/kit";
import * as postRepo from '$lib/server/repo/postRepo'
import type {FetchFunction, ICreatePost, IPost} from "$lib/types";

export async function getPosts( fetch: FetchFunction ): Promise<IPost[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!res.ok) error(res.status, res.statusText)
    // Use internal repo to work with CRUD endpoints
    const data = await res.json()
    postRepo.initPosts(data) // Initializing repository
    return postRepo.getPosts() // Returning from memory
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