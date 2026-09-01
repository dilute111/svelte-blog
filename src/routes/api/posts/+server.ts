import {createPost, getPosts} from "$lib/server/services/postsService";
import {error, json} from "@sveltejs/kit";
import type {ICreatePost, IPost} from "$lib/types";
import {createPostSchema} from "$lib/server/validation/postSchema";



export async function GET({ fetch }) {

    const posts: IPost[] = await getPosts(fetch)
    return json(posts)
}

export async function POST({ request }) {
    // 1. Parse request data
    const { title, body } = await request.json() as ICreatePost
    const parsed = createPostSchema.safeParse({ title, body });

    // 2. Validation
    if (!parsed.success) {
        error(400, parsed.error.issues[0].message);
    }

    // 3. Create post
    const newPost: IPost = await createPost(parsed.data)

    // 4. Return response
    return json(newPost, { status: 201 })
}