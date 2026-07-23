<script lang="ts">
    import type {IModal} from "$lib/types";

    let { isOpen, onClose }: IModal = $props()

    function handleOutsideClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    $effect(() => {
        function handleKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeydown)
        return () => window.removeEventListener('keydown', handleKeydown)
    })

    $effect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    })

</script>


{#if isOpen}
    <div class="modal-overlay" on:click={handleOutsideClick}>
        <div class="modal-content" role="dialog" aria-modal="true">
            <button class="modal-close" on:click={onClose} aria-label="Закрыть">
                ✕
            </button>
            <div class="modal-body">
                <slot/>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }

    .modal-content {
        background: #ffffff; /* Явно белый фон */
        border-radius: 16px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
        animation: slideUp 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #1a1a2e; /* Тёмный текст на светлом фоне */
    }

    /* Если нужна тёмная тема — используем тёмно-серый, но НЕ прозрачный */
    /* background: #1e1e2e; */
    /* color: #e0e0e0; */

    .modal-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        font-size: 1.5rem;
        color: #666;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #000;
    }

    .modal-body {
        margin-top: 0.5rem;
    }

    /* Стили для инпутов внутри модалки (если нужно переопределить) */
    .modal-body :global(input),
    .modal-body :global(textarea) {
        background: #f5f5f7 !important;
        color: #1a1a2e !important;
        border-color: #ddd !important;
    }

    .modal-body :global(input:focus),
    .modal-body :global(textarea:focus) {
        border-color: var(--primary-color) !important;
    }

    .modal-body :global(label) {
        color: #1a1a2e !important;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal-content::-webkit-scrollbar {
        width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
        background: transparent;
    }

    .modal-content::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
        background: #999;
    }
</style>