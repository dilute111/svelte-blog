import {type Actions, fail} from "@sveltejs/kit";
import {createPost} from "$lib/server/services/postsService";
import type {ICreatePost} from "$lib/types";
import {logout} from "$lib/shared/auth";
import {INTERNAL_ROUTES} from "$lib/config/routes";
import {requireAuth} from "$lib/server/middleware/auth";
import {createPostSchema} from "$lib/server/validation/postSchema";

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
    // Создание поста неявно вызывается внутри TheForm.svelte, делая запрос на экшен (fetch('?/create'))
    // requireAuth здесь обязателен, т.к. хуки не перехватывают POST-запросы к экшенам.
    create: async ({ request, locals }) => {
        requireAuth(locals)
        const data = await request.formData();

        const parsed = createPostSchema.safeParse({
            title: data.get('title') ?? '',
            body: data.get('body') ?? '',
        });

        if (!parsed.success) {
            return fail(400, {
                error: parsed.error.issues[0].message
            });
        }

        await createPost( parsed.data );
        return { success: true };
    }
};