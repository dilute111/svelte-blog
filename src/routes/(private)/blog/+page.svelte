<script lang="ts">

    import Loader from "$lib/components/Loader.svelte";
    import {onMount} from "svelte";
    import {logout} from "$lib/shared/auth";

    import TheForm from "$lib/components/TheForm.svelte";
    import {invalidate} from "$app/navigation";
    import Modal from "$lib/components/Modal.svelte";

    let {data} = $props()

    let shouldLogout = $state(false);
    let isModalOpen = $state(false)

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
        isModalOpen = false
    }

    function openModal() {
        isModalOpen = true
    }

    function closeModal() {
        isModalOpen = false
    }

</script>

<svelte:head>
    <title>Blog page | SvelteKit</title>
</svelte:head>

<div class="blog-header">
    <h1>Blog</h1>
    <button class="create-post-btn" on:click={openModal}>
        + Создать пост
    </button>
</div>

<Modal isOpen={isModalOpen} onClose={closeModal}>
    <h2>Создать новый пост</h2>

    <TheForm
            fields={[
        { name: 'title', label: 'Заголовок', placeholder: 'Введите заголовок' },
        { name: 'body', label: 'Текст', type: 'textarea', placeholder: 'Введите текст поста' }
    ]}
            submitText="Создать пост"
            onSubmit={handlePostCreated}
    />
</Modal>

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

<style>
    .blog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .blog-header h1 {
        margin: 0;
    }

    .create-post-btn {
        padding: 0.6rem 1.2rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius, 8px);
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
    }

    .create-post-btn:hover {
        background: var(--primary-hover);
    }

    .create-post-btn:active {
        transform: scale(0.95);
    }

    .posts-list {
        list-style: none;
        padding: 0;
    }

    .posts-list li {
        margin-bottom: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
    }

    .posts-list li:last-child {
        border-bottom: none;
    }

    .posts-list a {
        text-decoration: none;
        color: var(--text-color);
        transition: color 0.2s;
    }

    .posts-list a:hover {
        color: var(--primary-color);
    }

    .empty-state {
        text-align: center;
        color: var(--text-muted);
        padding: 3rem 0;
    }

    .error-text {
        color: #dc2626;
        padding: 1rem;
        background: #fef2f2;
        border-radius: var(--border-radius, 8px);
    }

    /* Стили для заголовка в модалке */
    :global(.modal-body h2) {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        color: var(--text-color);
    }
</style>