<script>
    import { page } from '$app/state'
    import {resolve} from "$app/paths";
</script>

<header>
    <a href={resolve("/")} class={page.url.pathname === '/' ? 'active' : ''}>Home</a>
    <a href={resolve("/blog")} class={page.url.pathname.startsWith('/blog') ? 'active' : ''}>Blog</a>
    <a href={resolve("/about")} class={page.url.pathname.startsWith('/about') ? 'active' : ''}>About</a>
</header>