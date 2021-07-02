<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS } from '$lib/enums';

	let status = STATUS.UNSTARTED;
	let masterIndex: object;

	CollectionBuilder.iniateBuild().then(function (newStatus) {
		status = newStatus;
		masterIndex = CollectionBuilder.getMasterIndex();
		console.log('>->masterIndex', masterIndex);
	});
</script>

<svelte:head>
	<title>About</title>
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
						>{tableName}</button>
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
