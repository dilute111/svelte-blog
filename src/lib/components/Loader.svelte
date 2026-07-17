<script lang="ts">
    let { size = '2em', color = '#6c5ce7' } = $props()
</script>

<div class="loader" style="--size: {size}; --color: {color}">
    <div></div>
</div>

<style>
    .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 0
    }
    .loader div {
        width: var(--size);
        height: var(--size);
        border: 4px solid rgba(108, 92, 231, 0.1);
        border-top-color: var(--color);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>