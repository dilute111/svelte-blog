import {getPost, updatePost} from "$lib/server/services/postService";
import {error, json} from "@sveltejs/kit";
import type {IPost, IUpdatePostData} from "$lib/types";
import {requireAuth} from "$lib/server/middleware/auth";

// GET - Получить один пост (устанавливается во внутреннем API)
export async function GET({ params, fetch }) {
    try {
        const post: IPost = await getPost(params.id, fetch)
        return json(post)
    } catch {
        error(404, 'Post not found')
    }
}

export async function PUT({ params, request, locals }){
    requireAuth(locals)

    const { id } = params
    const data: IUpdatePostData = await request.json()

    if (!data.title && !data.body) {
        error(400, 'At least one field (title or body) is required')
    }

    const updated = await updatePost(Number(id), data)
    return json(updated)
}