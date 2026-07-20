<script lang="ts">

    import Loader from "$lib/components/Loader.svelte";
    import {onMount} from "svelte";
    import {logout} from "$lib/shared/auth";

    import TheForm from "$lib/components/TheForm.svelte";
    import {invalidate} from "$app/navigation";

    let {data} = $props()

    let shouldLogout = $state(false);
    // Extract shouldLogout flag from the resolved posts data
    $effect(() => {
        const result = data.posts as { shouldLogout?: boolean };
        if (result?.shouldLogout) {
            shouldLogout = true;
        }
    });

    onMount(() => {
        if (shouldLogout) {
            logout()
        }
    })

    async function handlePostCreated() {
        await invalidate('app:auth');
    }

</script>

<svelte:head>
    <title>Blog page | SvelteKit</title>
</svelte:head>

<h1>Blog</h1>

<TheForm
        fields={[
        { name: 'title', label: 'Заголовок', placeholder: 'Введите заголовок' },
        { name: 'body', label: 'Текст', type: 'textarea', placeholder: 'Введите текст поста' }
    ]}
        submitText="Создать пост"
        onSubmit={handlePostCreated}
/>

{#await data.posts}
    <Loader/>
{:then result}
    {#each result.posts as post (post.id)}
        <li>
            <a href={`/blog/${post.id}`}>{post.title}</a>
        </li>
    {/each}
{:catch err}
    <p style="color: red">{err.message}</p>
{/await}