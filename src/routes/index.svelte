<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { viewsBuilt } from '$lib/stores';
	import { STATUS } from '$lib/enums';
	import Errors from '$lib/UI/BuildErrors.svelte';
	import LoadedCollections from '$lib/UI/loadedCollections.svelte';

	let status = STATUS.UNSTARTED;
	viewsBuilt.subscribe((value) => {
		status = value;
	});
	onMount(async () => {
		const CollectionBuilder = await import('$lib/CollectionsBuilder');
		CollectionBuilder.default.iniateBuild().then(function (newStatus) {
			viewsBuilt.set(newStatus);
		});
	});
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

	{#if status === STATUS.BUILT}
		<a class:active={$page.url.pathname === '/table'} sveltekit:prefetch href="/table"
			><button>Go to Tables</button></a
		>
	{:else}
		<h3>Generating data from tables</h3>
	{/if}

	<LoadedCollections />

	<Errors />
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
