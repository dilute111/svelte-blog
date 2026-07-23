import {requireAuth} from "$lib/server/middleware/auth";
import type {Handle} from "@sveltejs/kit";


export const handle: Handle = async({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session')

    event.locals.isAuthorized = sessionCookie === "true"

    if (event.url.pathname.startsWith('/api')) {
        requireAuth(event.locals)
    }

    return resolve(event)
}