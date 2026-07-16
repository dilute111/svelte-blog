import {error} from "@sveltejs/kit";

export function requireAuth(locals: App.Locals) {
    if (!locals.isAuthorized) {
        error(401, 'Unauthorized');
    }
}