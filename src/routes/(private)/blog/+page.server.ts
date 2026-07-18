export async function load({fetch, depends}) {
    depends('app:auth')

    const fetchPosts = async () => {
        const res = await fetch('/api/posts')
        if (res.status === 401) {
            return {
                posts: [],
                error: 'Unauthorized',
                shouldLogout: true
            }
        }
        const posts = await res.json()
        return {posts}
    }


    return {
        posts: fetchPosts()
    }


}