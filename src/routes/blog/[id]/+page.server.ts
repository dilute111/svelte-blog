import { getPost }  from "$lib/server/services/postService";


export async function load({ params, fetch }) {
    const { id } = params

    return {
        post: getPost(id, fetch)
    }
}