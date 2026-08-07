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
    let isEditing = $state(false);
    let editTitle = $state('');
    let editBody = $state('');
    let notificationRef: { show: (msg: string, type: string) => void };

    const postsStore = usePostsSvelte(data.postsPromise);

    $effect(() => {
        if (post) {
            editTitle = post.title;
            editBody = post.body;
        }
    });

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

    async function handleSavePost() {
        const data = { title: editTitle, body: editBody };
        const id = Number(window.location.pathname.split('/').pop());

        // 1. Оптимистичное обновление
        const updatedPost = postsStore.updatePostOptimistically(id, data);
        if (updatedPost) {
            post = updatedPost;  // ← сразу обновляем локальный post
        }

        notificationRef?.show('Обновляем пост...', 'info');

        let timeoutId: NodeJS.Timeout;
        let timeoutFired = false;

        // 2. Таймаут 3 секунды
        timeoutId = setTimeout(() => {
            timeoutFired = true;
            postsStore.loadFromCache();
            notificationRef?.show('Данные из кэша (сервер не отвечает)', 'info');
        }, 3000);

        try {
            // 3. Promise.race с таймаутом 5 секунд
            const result = await Promise.race([
                postsStore.updatePostOnServer(id, data),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                )
            ]);

            if (result) {
                post = result;
            }
            notificationRef?.show('Пост обновлён!', 'success');
            isEditing = false;
        } catch {
            if (!timeoutFired) {
                notificationRef?.show('Ошибка при обновлении поста', 'error');
                postsStore.loadFromCache();
                // Обновление post из кэша при ошибке
                const cached = postsStore.getPost(id);
                if (cached) {
                    post = cached;
                }
            }
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function handleCancel() {
        isEditing = false;
        // Возвращаем исходный пост из кэша
        if (post) {
            const cached = postsStore.getPost(post.id);
            if (cached) {
                post = cached;
            }
        }

    }
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
    <PostDetail post={post}
                error={error}
                isEditing={isEditing}
                editTitle={editTitle}
                editBody={editBody}
                onTitleChange={(v) => editTitle = v}
                onBodyChange={(v) => editBody = v}
                onSave={handleSavePost}
                onCancel={handleCancel}
                onEdit={() => isEditing = true}
    />
{/if}
