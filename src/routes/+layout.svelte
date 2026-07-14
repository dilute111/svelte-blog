<script lang="ts">

    import TheHeader from "$lib/components/TheHeader.svelte";
    import TheFooter from "$lib/components/TheFooter.svelte";

    let {children} = $props();
</script>

<TheHeader/>

<main class="container">
        {@render children() }
</main>

<TheFooter/>