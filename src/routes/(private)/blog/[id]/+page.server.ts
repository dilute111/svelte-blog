

export async function load({ params, fetch, depends }) {
    depends('app:auth')

    const { id } = params
    const res = fetch(`/api/posts/${id}`)
    return {
        post: res.then(r => r.json())
    }
}