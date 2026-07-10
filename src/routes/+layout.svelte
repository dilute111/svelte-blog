<script lang="ts">

	import TheHeader from "$lib/TheHeader.svelte";
	import TheFooter from "$lib/TheFooter.svelte";

	let { children } = $props();
</script>

<TheHeader/>

<main class="container">
	{@render children() }
</main>

<TheFooter/>