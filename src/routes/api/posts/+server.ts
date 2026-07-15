import {getPosts} from "$lib/server/services/postService";
import {error, json} from "@sveltejs/kit";


export async function GET({ fetch, locals }) {
    if (!locals.isAuthorized) {
        error(401, 'Unauthorized');
    }

    const posts = await getPosts(fetch)
    return json(posts)
}