import type {IBlogIdPageData} from "$lib/types";

export async function load({ params, fetch, depends }) {
    depends('app:auth')

    const { id } = params as { id: string }

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/posts/${id}`)
            if (!res.ok) throw new Error('Post not found')
            return await res.json()
        } catch {
            return null
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts')
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