import type {IPost} from "$lib/types/post";

export interface IBlogPageData {
    posts: Promise<{
        posts: IPost[]
        shouldLogout?: boolean
    }>
}