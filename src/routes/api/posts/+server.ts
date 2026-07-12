import {getPosts} from "$lib/server/services/postService";
import {json} from "@sveltejs/kit";


export async function GET({ fetch }) {
    // TODO: добавить проверку на авторизацию + создать кнопки "Вход" и "Выход на других уровнях для сеттинга авторизованности"
    const posts = await getPosts(fetch)
    return json(posts)
}