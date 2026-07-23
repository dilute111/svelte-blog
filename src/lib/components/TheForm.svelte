<script lang="ts">
    import { enhance } from '$app/forms';
    import {invalidate} from "$app/navigation";
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
        error = err instanceof Error? err.message : 'Произошла ошибка при отправке'
        isSubmitting = false
    }

    async function handleFormSubmit({ formData: fd, cancel }: { formData: FormData; cancel: () => void }) {
        isSubmitting = true
        error = null

        try {
            const response = await fetch(formElement?.action || '', {
                method: 'POST',
                body: fd
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Ошибка отправки')
            }

            resetForm()

            if (onSubmit) {
                await onSubmit(result)
            }
            await invalidate('app:auth');

        } catch (err) {
            handleError(err)
        } finally {
            isSubmitting = false
        }

        cancel()
    }
</script>

<form method="POST" action="?/create" use:enhance={handleFormSubmit} bind:this={formElement}>
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