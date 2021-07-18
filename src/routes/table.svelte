<script context="module">
	import { browser } from '$app/env';
	export const router = browser;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS } from '$lib/enums';
	console.log('run tables script');

	let status = STATUS.UNSTARTED;
	let masterIndex = {};
	let view = 'all';

	onMount(async () => {
		status = CollectionBuilder.getStatus();
		if (status !== STATUS.BUILT) {
			console.log('not built');
		}
		if (view === 'all') {
			masterIndex = CollectionBuilder.getMasterIndex();
		}
	});
</script>

<svelte:head>
	<title>Tables</title>
</svelte:head>

<div class="content">
	<h3>Building indexes....</h3>
	{#if status === STATUS.BUILT}
		<div>Built</div>
		{#each Object.keys(masterIndex) as collection}
			<h3>Collection: {masterIndex[collection].collectionName}</h3>
			{#each Object.keys(masterIndex[collection].tablesData) as tablesGroupKey}
				<h4>{tablesGroupKey}</h4>
				{#each masterIndex[collection].tablesData[tablesGroupKey].tablesList as tableName}
					<button on:click={() => CollectionBuilder.getRoll(collection, tablesGroupKey, tableName)}
						>{tableName}</button
					>
				{/each}
			{/each}
		{/each}
	{/if}
	<h3>Views</h3>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
