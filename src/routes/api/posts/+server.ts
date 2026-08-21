import {createPost, getPosts} from "$lib/server/services/postsService";
import {error, json} from "@sveltejs/kit";
import type {ICreatePost, IPost} from "$lib/types";



export async function GET({ fetch }) {

    const posts: IPost[] = await getPosts(fetch)
    return json(posts)
}

export async function POST({ request }) {
    // 1. Check authorization

    // 2. Parse request body
    const { title, body } = await request.json() as ICreatePost

    // 3. Validation
    if (!title || !body) {
        error(400, 'Title and body are required')
    }

    // 4. Create post
    const newPost: IPost = await createPost({ title, body})

    // 5. Return response
    return json(newPost, { status: 201 })
}