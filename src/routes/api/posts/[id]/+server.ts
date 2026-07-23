import {getPost} from "$lib/server/services/postService";
import {error, json} from "@sveltejs/kit";
import type {IPost} from "$lib/types";

export async function GET({ params, fetch }) {
    try {
        const post: IPost = await getPost(params.id, fetch)
        return json(post)
    } catch {
        error(404, 'Post not found')
    }
}