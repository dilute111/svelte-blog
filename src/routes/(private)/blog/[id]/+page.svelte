<script lang="ts">
    import {onMount} from "svelte";
    import Loader from "$lib/components/Loader.svelte";
    import type {IBlogIdPageData, IPost} from "$lib/types";
    import {usePostsSvelte} from "$lib/hooks/usePosts.svelte";
    import PostDetail from "$lib/components/PostDetail.svelte";

    let {data}: { data: IBlogIdPageData } = $props();

    let post = $state<IPost | null>(null);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    const postsStore = usePostsSvelte(data.postsPromise);

    onMount(async () => {
        const id = Number(window.location.pathname.split('/').pop());

        let timeoutId: NodeJS.Timeout;
        let resolved = false

        timeoutId = setTimeout(() => {
            if (resolved) return;

            postsStore.loadPosts().then(() => {
                if (resolved) return;

                const found = postsStore.getPost(id);
                if (found) {
                    post = found;
                    isLoading = false;
                    resolved = true;
                    return;
                }
                error = 'Пост не найден (таймаут)';
                isLoading = false;
                resolved = true;
            });
        }, 3000);


        try {
            const result = await data.post;
            clearTimeout(timeoutId);

            if (result) {
                post = result;
                isLoading = false;
                resolved = true
                return;
            }
        } catch {
            // Data post error
        }

        if (resolved) return;
        clearTimeout(timeoutId);

        await postsStore.loadPosts();
        clearTimeout(timeoutId);
        const found = postsStore.getPost(id);
        if (found) {
            post = found;
            isLoading = false;
            resolved = true
            return;
        }
        post = null;
        error = 'Пост не найден';
        isLoading = false;
        resolved = true
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
{:else}
    <PostDetail post={post} error={error}/>
{/if}
