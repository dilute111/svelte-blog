

export async function load({ fetch }) {
    const res = fetch('/api/posts')
    return {
        posts: res.then(r => r.json())
    }
}