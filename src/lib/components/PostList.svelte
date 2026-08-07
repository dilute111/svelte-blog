<script lang="ts">
    import type {IPostListProps} from "$lib/types";

    let {posts, isFromCache, onDelete}: IPostListProps = $props();
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
                <button class="btn-delete"
                        onclick={() => onDelete?.(post.id)}
                        title="Удалить пост">
                    Удалить пост 🗑️
                </button>
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

    .btn-delete {
        padding: 0.2rem 0.6rem;
        background: transparent;
        color: #ef4444;
        border: 1px solid #ef4444;
        border-radius: var(--border-radius, 6px);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        flex-shrink: 0;
    }

    .btn-delete:hover {
        background: #ef4444;
        color: white;
    }

</style>