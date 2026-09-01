import {deletePost, getPost, updatePost} from "$lib/server/services/postsService";
import {error, json} from "@sveltejs/kit";
import type {IPost, IUpdatePostData} from "$lib/types";
import {updatePostSchema} from "$lib/server/validation/postSchema";

// GET - Получить один пост (устанавливается во внутреннем API)
export async function GET({params, fetch}) {
    try {
        const post: IPost = await getPost(params.id, fetch)
        return json(post)
    } catch {
        error(404, 'Post not found')
    }
}

export async function PUT({params, request}) {
    // 1. Parse request data
    const {id} = params
    const data: IUpdatePostData = await request.json()
    const parsed = updatePostSchema.safeParse(data);

    // 2. Validation
    if (!parsed.success) {
        error(400, parsed.error.issues[0].message);
    }

    // 3. Create post
    const updated = await updatePost(Number(id), parsed.data)

    // 4. Return response
    return json(updated)
}

export async function DELETE({params}) {
    const {id} = params
    await deletePost(Number(id))
    return json({success: true})
}