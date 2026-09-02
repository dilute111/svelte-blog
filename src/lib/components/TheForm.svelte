<script lang="ts">
    import type {IFormProps} from "$lib/types";

    let {fields, submitText = 'Отправить', onSubmit}: IFormProps = $props()

    let formData = $state<Record<string, string>>({})
    let isSubmitting = $state(false)
    let error = $state<string | null>(null)

    let formElement: HTMLFormElement | undefined = $state()

    function handleInput(name: string, value: string) {
        formData[name] = value
    }

    function resetForm() {
        fields.forEach(f => formData[f.name] = '')
        error = null
    }

    function handleError(err: unknown) {
        error = err instanceof Error ? err.message : 'Произошла ошибка при отправке'
        isSubmitting = false
    }

    async function handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const title = fd.get('title') as string;
        const body = fd.get('body') as string;

        isSubmitting = true
        error = null

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body })
            });

            const resultData = await response.json();

            // Проверяем success из ответа
            if (!response.ok || resultData.success === false) {
                throw new Error(resultData.error || 'Ошибка валидации');
            }

            // Вызываем onSubmit с данными
            await onSubmit?.({title, body}, {
                success: true,
                message: resultData.message
            });

            resetForm();

        } catch (err) {
            handleError(err);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<form method="POST" onsubmit={handleFormSubmit} bind:this={formElement}>
    {#if error}
        <div class="error-message">
            {error}
        </div>
    {/if}
    {#each fields as field (field.name)}
        <div class="form-group">
            <label for={field.name}>{field.label}</label>
            {#if field.type === 'textarea'}
                <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        oninput={(e) => handleInput(field.name, e.currentTarget.value)}
                        disabled={isSubmitting}
                />
            {:else}
                <input
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        oninput={(e) => handleInput(field.name, e.currentTarget.value)}
                        disabled={isSubmitting}
                />
            {/if}
        </div>
    {/each}

    <button type="submit" disabled={isSubmitting}>
        {#if isSubmitting}
            Отправка...
        {:else}
            {submitText}
        {/if}
    </button>
</form>

<style>
    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 500;
        color: var(--text-color);
    }

    input, textarea {
        width: 100%;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--border);
        border-radius: var(--border-radius, 8px);
        background: var(--bg-card);
        color: var(--text-color);
        transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    textarea {
        min-height: 120px;
        resize: vertical;
    }

    button {
        width: 100%;
        padding: 0.6rem 1.2rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius, 8px);
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    button:hover:not(:disabled) {
        background: var(--primary-hover);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-message {
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: var(--border-radius, 8px);
        font-size: 0.9rem;
    }
</style>