export interface IPost {
    id: number
    title: string
    body: string
    userId?: number
    createdAt?: string
    updatedAt?: string
}

export interface ICreatePost {
    title: string
    body: string
}

export interface IUpdatePost {
    title?: string
    body?: string
}