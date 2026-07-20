import {type Actions, fail} from "@sveltejs/kit";
import {createPost} from "$lib/server/services/postService";
import {requireAuth} from "$lib/server/middleware/auth";

export async function load({fetch, depends}) {
    depends('app:auth')

    const fetchPosts = async () => {
        const res = await fetch('/api/posts')
        if (res.status === 401) {
            return {
                posts: [],
                error: 'Unauthorized',
                shouldLogout: true
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

    create: async ({ request, locals }) => {
        requireAuth(locals)

        const data = await request.formData();
        const title = data.get('title') as string;
        const body = data.get('body') as string;

        if (!title || !body) {
            return fail(400, { error: 'Title and body are required' });
        }

        await createPost({ title, body });
        return { success: true };
    }
};