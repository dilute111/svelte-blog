import type {IPost} from "$lib/types/post";

export interface IBlogIdPageData {
    post: Promise<IPost>
    postsPromise: Promise<{ posts: IPost[] }>
}