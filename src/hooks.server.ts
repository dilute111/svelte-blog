import {requireAuth} from "$lib/server/middleware/auth";


export async function handle({ event, resolve }) {
    const sessionCookie = event.cookies.get('session')

    event.locals.isAuthorized = sessionCookie === "true"

    if (event.url.pathname.startsWith('/api')) {
        requireAuth(event.locals)
    }

    return await resolve(event)
}