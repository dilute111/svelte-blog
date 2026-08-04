import type {ICreatePost, IPost, IUpdatePostData} from "$lib/types";

let posts: IPost[] = []
let nextId = 1
let initialized = false

export function initPosts(data: IPost[]) {
    if (!initialized) {
        posts = data.map(p => ({...p}))
        nextId = Math.max(...posts.map(p => p.id), 0) + 1
        initialized = true
    }
}

export function getPosts(): IPost[] {
    return posts
}

export function getPost(id: number): IPost | undefined {
    return posts.find(p => p.id === id)
}

export function createPost(data: ICreatePost): IPost {
    const newPost: IPost = { id: nextId++, ...data }
    posts.push(newPost)
    return newPost
}

export function updatePost( id: number, data: IUpdatePostData ): IPost | null {
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) return null

    const updated = { ...posts[index], ...data}
    posts[index] = updated
    return updated
}