<script lang="ts">
    import { page } from '$app/state'
</script>

<svelte:head>
    <title>{page.status} | SvelteKit</title>
</svelte:head>

<h1>{page.status} | {page.error?.message}</h1>