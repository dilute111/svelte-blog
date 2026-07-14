<script lang="ts">

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


<main class="container">
    {#if !isHydrated}
        <div>Loading...</div>
    {:else if isLoggedIn}
        {@render children() }
        {:else}
        <h2>Авторизируйтесь, чтобы открыть весь контент</h2>
    {/if}
</main>
