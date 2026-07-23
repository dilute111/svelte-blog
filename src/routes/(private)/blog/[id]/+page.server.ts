import type {IBlogIdPageData} from "$lib/types";

export async function load({ params, fetch, depends }) {
    depends('app:auth')

    const { id } = params as { id: string }
    const res = fetch(`/api/posts/${id}`)
    return {
        post: res.then(r => r.json())
    } satisfies IBlogIdPageData
}