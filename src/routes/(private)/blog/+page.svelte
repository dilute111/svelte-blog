<script lang="ts">

    import Loader from "$lib/components/Loader.svelte";
    import {onMount} from "svelte";
    import TheForm from "$lib/components/TheForm.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import type {IBlogPageData} from "$lib/types";
    import {usePostsSvelte} from "$lib/hooks/usePosts.svelte";
    import PostList from "$lib/components/PostList.svelte";
    import Notification from "$lib/components/Notification.svelte";
    import {goto} from "$app/navigation";

    let {data}: { data: IBlogPageData } = $props()

    let isModalOpen = $state(false)

    const posts = usePostsSvelte(data.posts);

    let isLoading = $derived(posts.isLoading);
    let postsData = $derived(posts.postsDataOrCachedPosts);
    let isFromCache = $derived(posts.isFromCache);

    onMount(async () => {
        // Костыль для показа уведомлений после перезагрузки страницы
        // (Без перезагрузки нет данных о текущем реальном посте и отображается закешированный по дефолту)
        const saved = sessionStorage.getItem('notification');
        if (saved) {
            try {
                const {message, type} = JSON.parse(saved);
                notificationRef?.show(message, type);
                sessionStorage.removeItem('notification');
            } catch {
                // ignore
            }
        }
        let timeoutId: NodeJS.Timeout;

        timeoutId = setTimeout(() => {
            posts.loadFromCache();
        }, 3000);

        await posts.loadPosts();
        clearTimeout(timeoutId);
    });

    let notificationRef: { show: (msg: string, type: string) => void };

    async function handlePostCreated(formData: Record<string, string>) {
        isModalOpen = false;

        posts.addPostOptimistically({
            title: formData.title,
            body: formData.body
        });

        notificationRef?.show('Пост создается...', 'info')

        let timeoutId: NodeJS.Timeout;
        let timeoutFired = false;

        timeoutId = setTimeout(() => {
            timeoutFired = true;
            posts.loadFromCache();
            sessionStorage.setItem('notification', JSON.stringify({
                message: 'Данные из кэша (сервер не отвечает)',
                type: 'info'
            }));
            window.location.reload();
        }, 3000);

        try {
            // Заворачиваем refreshPosts в Promise.race с таймаутом
            await Promise.race([
                posts.refreshPosts(true),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                )
            ]);
            sessionStorage.setItem('notification', JSON.stringify({
                message: 'Пост успешно создан!',
                type: 'success'
            }));
            window.location.reload();
        } catch {
            // Если таймаут или ошибка - показываем кэш
            if (!timeoutFired) {
                sessionStorage.setItem('notification', JSON.stringify({
                    message: 'Ошибка при создании поста',
                    type: 'error'
                }));
                window.location.reload();
                posts.loadFromCache();
            }
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function handleDeletePost(id: number) {
        // 1. Подтверждение удаления
        if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
            return
        }
        // 2. Оптимистичное удаление
        posts.deletePostOptimistically(id)
        notificationRef?.show('Пост удаляется...', 'info')

        let timeoutId: NodeJS.Timeout;
        let timeoutFired = false;

        timeoutId = setTimeout(() => {
            timeoutFired = true
            posts.loadFromCache()
            notificationRef?.show('Данные из кэша (сервер не отвечает)', 'info')
        }, 3000)

        try {
            // 3. Promise.race с таймаутом 5 секунд
            await Promise.race([
                posts.deletePostOnServer(id),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                )
            ])
            notificationRef?.show('Пост удалён!', 'success')
        } catch {
            if (!timeoutFired) {
                notificationRef?.show('Ошибка при удалении поста', 'error')
                await posts.loadFromCache()
            }
        } finally {
            clearTimeout(timeoutId)
            goto('/blog')
        }
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

<Notification bind:this={notificationRef} />

<div class="blog-header">
    <h1>Blog</h1>
    <button disabled={isLoading} class="create-post-btn" on:click={openModal}>
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

{#if isLoading || postsData === null}
    <Loader/>
{:else}
    <PostList posts={postsData} isFromCache={isFromCache} onDelete={handleDeletePost}/>
{/if}

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

    .create-post-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--border, #e5e7eb);
        color: var(--text-muted, #6b7280);
    }

    /* Стили для заголовка в модалке */
    :global(.modal-body h2) {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        color: var(--text-color);
    }
</style>