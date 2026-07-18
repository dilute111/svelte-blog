import {invalidate} from "$app/navigation";

const STORAGE_KEY = "isLoggedIn"

const listeners: (() => void)[] = []

export function getAuthStatus(): boolean {
    if (typeof window === 'undefined') return false
    const hasSessionCookie = document.cookie
        .split('; ')
        .some(row => row.startsWith('session=') && row.split('=')[1] === "true")
    return hasSessionCookie
}

export function login(): void {
    if (typeof window === 'undefined') return

    // localStorage - для UI
    localStorage.setItem(STORAGE_KEY, 'true')
    // Куки для сервера
    document.cookie = 'session=true; path=/; max-age=86400'

    invalidate('app:auth')

    listeners.forEach(fn => fn())
}

export function logout(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem(STORAGE_KEY)

    document.cookie = 'session=; path=/; max-age=0'

    invalidate('app:auth')

    listeners.forEach(fn => fn())
}

export function onAuthChange(fn: () => void): void {
    listeners.push(fn)
}