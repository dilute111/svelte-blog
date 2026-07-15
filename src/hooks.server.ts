

export async function handle({ event, resolve }) {
    const sessionCookie = event.cookies.get('session')

    event.locals.isAuthorized = sessionCookie === "true"

    return await resolve(event)
}