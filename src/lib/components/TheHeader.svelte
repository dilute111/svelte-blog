<script>
    import {page} from '$app/state'
    import {resolve} from "$app/paths";
    import {getAuthStatus, login, logout} from "$lib/shared/auth.js";

    let isLoggedIn = $state(getAuthStatus())
</script>

<header>
    <a href={resolve("/")} class={page.url.pathname === '/' ? 'active' : ''}>Home</a>
    <a href={resolve("/blog")} class={page.url.pathname.startsWith('/blog') ? 'active' : ''}>Blog</a>
    <a href={resolve("/about")} class={page.url.pathname.startsWith('/about') ? 'active' : ''}>About</a>

    <div class="auth">
        {#if isLoggedIn}
            <span>Вы авторизованы</span>
            <button onclick={() => { logout(); isLoggedIn = false }}>Выйти</button>
        {:else}
            <button onclick={() => { login(); isLoggedIn = true } }>Войти</button>
        {/if}
    </div>

</header>