<script lang="ts">
    import type { IPost } from "$lib/types";

    let { posts, isFromCache }: { posts: IPost[]; isFromCache: boolean } = $props();
</script>


{#if posts.length === 0}
    <p style="text-align: center; color: var(--text-muted);">
        Нет постов
    </p>
{:else}
    <ul class="posts-list">
        {#each posts as post (post.id)}
            <li>
                <a href={`/blog/${post.id}`}>{post.title}</a>
            </li>
        {/each}
    </ul>
    {#if isFromCache}
        <p style="color: orange; text-align: center;">
            Данные из кэша (ошибка подключения к серверу)
        </p>
    {/if}
{/if}

<style>

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

</style>