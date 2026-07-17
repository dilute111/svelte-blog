<script lang="ts">

    import Loader from "$lib/components/Loader.svelte";

    let {data} = $props()

</script>

<svelte:head>
    <title>Blog page | SvelteKit</title>
</svelte:head>

<h1>Blog</h1>
{#await data.posts}
    <Loader/>
{:then posts}
    {#each posts as post (post.id)}
        <li>
            <a href={`/blog/${post.id}`}>{post.title}</a>
        </li>
    {/each}
{:catch err}
    <p style="color: red">{err.message}</p>
{/await}