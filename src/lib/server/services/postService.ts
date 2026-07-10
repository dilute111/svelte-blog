import {error} from "@sveltejs/kit";

export async function getPosts( fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response> ) {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!res.ok) error(res.status, res.statusText)

    return res.json()
}

export async function getPost(id: string, fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

    if (!res.ok) error(res.status, res.statusText)

    return res.json()
}