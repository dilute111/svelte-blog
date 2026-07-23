import type {ICreatePost, IPost} from "$lib/types";


let posts: IPost[] = []
let nextId = 1
let initialized = false

export function initPosts(data: IPost[]) {
    if (!initialized) {
        posts = data.map(p => ({...p, id: p.id}))
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