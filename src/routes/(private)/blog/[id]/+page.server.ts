import type {IBlogIdPageData} from "$lib/types";

export async function load({ params, fetch, depends }) {
    depends('app:auth')

    const { id } = params as { id: string }


    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/posts/${id}`)
            if (!res.ok) throw new Error('Post not found')
            return await res.json()
        } catch {
            return null
        }

    }

    return {
        post: fetchPosts()
    } satisfies IBlogIdPageData
}