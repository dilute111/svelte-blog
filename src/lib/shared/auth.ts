import {invalidate} from "$app/navigation";

const STORAGE_KEY = "isLoggedIn"

const listeners: (() => void)[] = []

export function getAuthStatus(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function login(): void {
    if (typeof window === 'undefined') return

    // localStorage - для UI
    localStorage.setItem(STORAGE_KEY, 'true')
    // Куки для сервера
    document.cookie = 'session=true; path=/; max-age=3600'

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