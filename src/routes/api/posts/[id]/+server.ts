import {getPost} from "$lib/server/services/postService";
import {error, json} from "@sveltejs/kit";

export async function GET({ params, fetch }) {
    try {
        const post = await getPost(params.id, fetch)
        return json(post)
    } catch {
        error(404, 'Post not found')
    }
}