import {createPost, getPosts} from "$lib/server/services/postsService";
import {json} from "@sveltejs/kit";
import type {ICreatePost, IPost} from "$lib/types";
import {createPostSchema} from "$lib/server/validation/postSchema";
import {requireAuth} from "$lib/server/middleware/auth";

export async function GET({ fetch }) {
    const posts: IPost[] = await getPosts(fetch)
    return json(posts)
}

export async function POST({ request, locals }) {
    requireAuth(locals);

    // 1. Parse request data
    const { title, body } = await request.json() as ICreatePost
    const parsed = createPostSchema.safeParse({ title, body });

    // 2. Validation
    if (!parsed.success) {
        return json({
            success: false,
            error: parsed.error.issues[0].message
        }, { status: 400 });
    }

    // 3. Create post
    const newPost: IPost = await createPost(parsed.data)

    // 4. Return response
    return json({
        success: true,
        message: 'Пост создан успешно',
        post: newPost
    }, { status: 201 })
}