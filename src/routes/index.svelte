<script>
	import { onMount } from 'svelte';
	import { viewsBuilt } from '$lib/stores';
	import Card from '$lib/card/index.svelte';
	import { STATUS } from '$lib/enums';

	let status = STATUS.UNSTARTED;
	viewsBuilt.subscribe((value) => {
		status = value;
	});
	onMount(async () => {
		const CollectionBuilder = await import('$lib/CollectionsBuilder');
		CollectionBuilder.default.iniateBuild().then(function (newStatus) {
			viewsBuilt.update(() => newStatus);
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

	<h3>Views</h3>
	<div class="flextable">
		<Card hrefLink="/table" flex="0 1 35%"><p>All</p></Card>
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
