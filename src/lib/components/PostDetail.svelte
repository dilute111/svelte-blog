<script lang="ts">
    import type {IPostProps} from "$lib/types";

    let {
        post,
        error,
        isEditing = false,
        editTitle = '',
        editBody = '',
        onTitleChange,
        onBodyChange,
        onSave,
        onCancel,
        onEdit
    }: IPostProps = $props();

</script>

{#if post}
    <article class="post-detail">
        <div class="post-card">
            {#if isEditing}
                <input
                        value={editTitle}
                        oninput={(e) => onTitleChange?.(e.currentTarget.value)}
                        placeholder="Заголовок"
                />
                <textarea
                        value={editBody}
                        oninput={(e) => onBodyChange?.(e.currentTarget.value)}
                        rows={10}
                        placeholder="Текст поста"
                />
                <button onclick={() => onSave?.()}>Сохранить</button>
                <button onclick={onCancel}>Отмена</button>
            {:else}
                <h1>{post.title}</h1>
                <div class="post-body">
                    <p>{post.body}</p>
                </div>
                <button onclick={onEdit}>Редактировать</button>
            {/if}
        </div>
    </article>
{:else if error}
    <p class="error">{error}</p>
{:else}
    <p class="not-found">Пост не найден</p>
{/if}

<style>
    .post-detail {
        max-width: 720px;
        margin: 0 auto;
        padding: 1.5rem 0;
    }

    .post-card {
        background: var(--bg-card, #ffffff);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: var(--border-radius, 12px);
        padding: 2rem 2.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.2s;
    }

    .post-detail h1 {
        font-size: 2rem;
        margin-bottom: 0.75rem;
        color: var(--text-color, #1a1a1a);
        line-height: 1.3;
    }

    .post-body {
        font-size: 1.05rem;
        line-height: 1.8;
        color: var(--text-color, #1a1a1a);
        white-space: pre-wrap;
        word-break: break-word;
    }

    .error {
        color: #dc2626;
        padding: 1rem;
        background: #fef2f2;
        border-radius: var(--border-radius, 8px);
        text-align: center;
    }

    .not-found {
        color: var(--text-muted, #6b7280);
        text-align: center;
        padding: 2rem 0;
    }

    input, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    button {
        padding: 0.4rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: var(--primary-color);
        color: white;
        margin-right: 0.5rem;
    }

    button:hover { background: var(--primary-hover); }
</style>