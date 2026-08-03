<script lang="ts">
    let message = $state('')
    let type: 'success' | 'error' | 'info' = $state('success')
    let isVisible = $state(false)
    let timeoutId: NodeJS.Timeout

    export function show(msg: string, t: typeof type = 'success',) {
        message = msg
        type = t
        isVisible = true
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => isVisible = false, 3000)
    }
</script>

{#if isVisible}
    <div class="notification notification-{type}">
        {message}
    </div>
{/if}

<style>
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius, 8px);
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .notification-success {
        background: #22c55e;
    }

    .notification-error {
        background: #ef4444;
    }

    .notification-info {
        background: #3b82f6;
    }

    @keyframes slideIn {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>