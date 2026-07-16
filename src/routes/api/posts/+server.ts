import {getPosts} from "$lib/server/services/postService";
import {json} from "@sveltejs/kit";


export async function GET({ fetch }) {

    const posts = await getPosts(fetch)
    return json(posts)
}