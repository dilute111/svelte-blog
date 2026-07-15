

export async function load({ fetch, depends }) {
    depends('app:auth')

    const res = fetch('/api/posts')
    return {
        posts: res.then(r => r.json())
    }
}