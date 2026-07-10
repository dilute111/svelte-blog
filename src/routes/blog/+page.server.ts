import {getPosts} from "$lib/server/services/postService";

export async function load({ fetch }) {

    return {
        posts: getPosts(fetch)
    }
}