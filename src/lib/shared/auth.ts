
const STORAGE_KEY = "isLoggedIn"

let listeners: (() => void)[] = []

export function getAuthStatus(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function login(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, 'true')
    listeners.forEach(fn => fn())
}

export function logout(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    listeners.forEach(fn => fn())
}

export function onAuthChange(fn: () => void): void {
    listeners.push(fn)
}