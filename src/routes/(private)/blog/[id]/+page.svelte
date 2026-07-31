<script lang="ts">
    import { onMount } from "svelte";

    import Loader from "$lib/components/Loader.svelte";
    import type {IBlogIdPageData, IPost} from "$lib/types";
    import {usePostsSvelte} from "$lib/hooks/usePosts.svelte";

    let { data }: { data: IBlogIdPageData } = $props()

    const postsPromise = data.post.then(post => ({
        posts: post ? [post] : []
    }));

    let post = $state<IPost | null>(null);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    const postsStore = usePostsSvelte(postsPromise);

    onMount(async () => {
        const id = Number(window.location.pathname.split('/').pop());

        try {
            const result = await data.post;
            if (result) {
                post = result;
                isLoading = false;
                return;
            }
            // Если API не ответил - используем getPost из хука
            const found = postsStore.getPost(id);
            if (found) {
                post = found;
                isLoading = false;
                return;
            }
            // Если ничего не найдено
            post = null;
            error = 'Пост не найден';
            isLoading = false;
        } catch {
            // Если API упал - используем getPost из хука
            const found = postsStore.getPost(id);
            if (found) {
                post = found;
                isLoading = false;
                return;
            }
            post = null;
            error = 'Ошибка загрузки поста';
            isLoading = false;
        }
    });

</script>

<svelte:head>
    {#if post }
    	<title>{post.title} | SvelteKit</title>
    {:else if error}
        <title>{error} | SvelteKit</title>
    {:else}
        <title>Загрузка...</title>
    {/if}
</svelte:head>

<a href="/blog">Back to blog</a>

{#if isLoading}
    <Loader/>
{:else if post}
    <h1>{post.title}</h1>
    <p>{post.body}</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else}
    <p>Пост не найден</p>
{/if}
