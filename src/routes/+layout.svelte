<script lang="ts">

    import TheHeader from "$lib/components/TheHeader.svelte";
    import TheFooter from "$lib/components/TheFooter.svelte";
    import {getAuthStatus, onAuthChange} from "$lib/shared/auth";
    import {onMount} from "svelte";

    let isLoggedIn = $state(getAuthStatus())
    let isHydrated = $state(false)

    onMount(() => {
        isLoggedIn = getAuthStatus()
        isHydrated = true
    })

    onAuthChange(() => {
        isLoggedIn = getAuthStatus()
    })

    let {children} = $props();
</script>

<TheHeader/>

<main class="container">
    {#if !isHydrated}
        <div>Loading...</div>
    {:else if isLoggedIn}
        {@render children() }
    {:else}
        <div class="auth-message">
            <h2>Авторизируйтесь, чтобы продолжить</h2>
        </div>
    {/if}
</main>

<TheFooter/>