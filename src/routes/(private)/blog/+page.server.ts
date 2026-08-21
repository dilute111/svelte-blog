import {type Actions, fail} from "@sveltejs/kit";
import {createPost} from "$lib/server/services/postsService";
import type {ICreatePost} from "$lib/types";
import {logout} from "$lib/shared/auth";
import {INTERNAL_ROUTES} from "$lib/config/routes";

export async function load({fetch, depends}) {
    depends('app:auth')

    const fetchPosts = async () => {
        const res = await fetch(`${INTERNAL_ROUTES.posts}`)
        if (res.status === 401) {
            logout()
            return {
                posts: [],
                error: 'Unauthorized',
            }
        }
        const posts = await res.json()
        return {posts}
    }
    return {
        posts: fetchPosts()
    }
}

export const actions: Actions = {

    create: async ({ request }) => {

        const data = await request.formData();
        const postData: ICreatePost = {
            title: data.get('title') as string,
            body: data.get('body') as string
        }

        if (!postData.title || !postData.body) {
            return fail(400, { error: 'Title and body are required' });
        }

        await createPost( postData );
        return { success: true };
    }
};