<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Card from '$lib/card/index.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>Table Roller</h1>
	<p>
		Welcome to the table roller app, select a view (a subset of available tables) and begin rolling.
	</p>
	<p>For additional collections go to https://...</p>

	<h3>Views</h3>
	<div class="flextable">
		<Card href="/about" flex="0 1 35%"><p>All</p></Card>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

</style>
