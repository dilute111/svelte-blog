import {deletePost, getPost, updatePost} from "$lib/server/services/postsService";
import {json} from "@sveltejs/kit";
import type {IPost, IUpdatePostData} from "$lib/types";
import {updatePostSchema} from "$lib/server/validation/postSchema";
import {requireAuth} from "$lib/server/middleware/auth";

// GET - Получить один пост (устанавливается во внутреннем API)
export async function GET({params, fetch}) {
    try {
        const post: IPost = await getPost(params.id, fetch)
        return json(post)
    } catch {
        return json({
            success: false,
            error: 'Post not found'
        }, { status: 404 })
    }
}

export async function PUT({params, request, locals}) {
    requireAuth(locals);

    // 1. Parse request data
    const {id} = params
    const data: IUpdatePostData = await request.json()
    const parsed = updatePostSchema.safeParse(data);

    // 2. Validation
    if (!parsed.success) {
        return json({
            success: false,
            error: parsed.error.issues[0].message
        }, { status: 400 });
    }

    // 3. Update post
    const updated = await updatePost(Number(id), parsed.data)

    // 4. Return response
    return json({
        success: true,
        message: 'Пост обновлён успешно',
        post: updated
    })
}

export async function DELETE({params, locals}) {
    requireAuth(locals);

    const {id} = params
    await deletePost(Number(id))
    return json({success: true})
}