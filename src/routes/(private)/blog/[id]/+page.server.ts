import type {IBlogIdPageData} from "$lib/types";
import {INTERNAL_ROUTES} from "$lib/config/routes";

export async function load({ params, fetch, depends }) {
    depends('app:auth')

    const { id } = params as { id: string }

    const fetchPost = async () => {
        try {
            const res = await fetch(`${INTERNAL_ROUTES.post(id)}`)
            if (!res.ok) throw new Error('Post not found')
            return await res.json()
        } catch {
            return null
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${INTERNAL_ROUTES.posts}`)
            if (!res.ok) throw new Error('Posts not found')
            return await res.json()
        } catch {
            return { posts: [] }
        }
    }

    return {
        post: fetchPost(),
        postsPromise: fetchPosts()
    } satisfies IBlogIdPageData
}