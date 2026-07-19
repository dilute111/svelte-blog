

let posts: any[] = []
let nextId = 1
let initialized = false

export function initPosts(data: any[]) {
    if (!initialized) {
        posts = data.map(p => ({...p, id: p.id}))
        nextId = Math.max(...posts.map(p => p.id), 0) + 1
        initialized = true
    }
}

export function getPosts() {
    return posts
}

export function getPost(id: number) {
    return posts.find(p => p.id === id)
}

export function createPost(data: { title?: string; body?: string }) {
    const newPost = { id: nextId++, ...data }
    posts.push(newPost)
    return newPost
}